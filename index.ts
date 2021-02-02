/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import {
  blueify,
  curlyQuote,
  ellipsify,
  underline,
} from '@openinf/util-text';
import {
  InvalidArgsNumberError,
  InvalidArgTypeError,
  InvalidArgValueError,
  InvalidPropertyValueError,
} from '@openinf/util-errors';
import { Octokit } from '@octokit/rest';
import { basename as pathBasename, resolve as pathResolve } from 'path';
import { writeFile } from 'fs/promises';
import log, { Logger } from 'console-log-level';
import fetch from 'node-fetch';

interface GhFileImporterOpts {
  destDir: string,
  log?: Logger
}


// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export class GhFileImporter {
  octokit!:Octokit;
  options!:GhFileImporterOpts;
  log!:Logger;

  /**
   * Creates an instance of GhFileImporter.
   * @param {(GhFileImporterOpts | undefined)} options The options object.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @returns {GhFileImporter}
   */
  constructor(opts:GhFileImporterOpts) {
    // TODO: Somehow validate the options passed in better.
    if (opts === undefined) {
    } else if (typeof opts.destDir !== 'string') {
      throw new InvalidArgTypeError('opts.destDir', 'string', opts.destDir);
    } else if (opts.destDir.length === 0) {
      throw new InvalidPropertyValueError('opts', 'destDir',
        opts.destDir,
        'is invalid because an empty string was provided');
    }

    this.log = opts.log ? opts.log : log({ level: 'info' });
    this.options = opts; // Assign user-specified options.

    if (process.env.GITHUB_TOKEN) {
      // Use personal access token to prevent exceeding GitHub API rate limits.
      this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    } else {
      this.octokit = new Octokit({});
    }
  }

  /* eslint-disable no-unused-vars */

  /**
   * Retrieves a path's metadata.
   * @param {string} owner The username associated with the repository.
   * @param {string} repo The repository name.
   * @param {!(string | undefined)} path The path to the file or folder.
   * @param {!(string | undefined)} ref The name of the commit/branch/tag.
   * @returns {Promise<any>} An object containing the path metadata.
   */
  async fetchPathMetadata(owner:string, repo:string,
    path:(undefined | string) = undefined,
    ref:(undefined | string) = undefined):Promise<any> {
    /* eslint-enable no-unused-vars */
    const args = Array.from(arguments);
    const argNames = ['owner', 'repo', 'path', 'ref'];
    const octokitOptsMap = new Map();

    args.forEach((value, index) => {
      switch (argNames[index]) {
        case 'owner':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'repo':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'path':
          if (value === undefined) {
            this.log.debug(
              `The ${curlyQuote('path')} argument was missing and has been ` +
              `omitted causing Octokit to use the repo root directory`
            );
          } else if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else {
            octokitOptsMap.set(argNames[index], value);
          }
          break;
        case 'ref':
          if (value === undefined) {
            this.log.debug(
              `The ${curlyQuote('ref')} argument was missing and has been ` +
              `omitted causing Octokit to use the repo default branch ` +
              `(often ${curlyQuote('main')})`
            );
          } else if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else {
            octokitOptsMap.set(argNames[index], value);
          }
          break;
        default:
          throw new InvalidArgsNumberError('fetchPathMetadata', argNames.length,
            args.length);
      }
    });

    return this.octokit.repos.getContent(Object.fromEntries(octokitOptsMap));
  }


  /**
   * Retrieves a GitHub repo's metadata.
   * @param {string} owner The repo owner (username).
   * @param {string} repo The repo name.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @returns {Promise<string>} The file contents.
   */
  async fetchRepoMetadata(owner:string, repo:string):Promise<any> {
    if (typeof owner !== 'string') {
      throw new InvalidArgTypeError('owner', 'string', owner);
    } else if (owner.length === 0) {
      throw new InvalidArgValueError('owner', owner, 'is invalid because an ' +
        'empty string was provided');
    } else if (typeof repo !== 'string') {
      throw new InvalidArgTypeError('repo', 'string', repo);
    } else if (repo.length === 0) {
      throw new InvalidArgValueError('repo', repo, 'is invalid because an ' +
        'empty string was provided');
    }

    const repoMetadata = await this.octokit.repos.get({
      owner,
      repo,
    });

    return repoMetadata;
  }

  /**
   * Downloads a file from a remote GitHub repository and returns its contents.
   * @param {string} url The string representation of a remote file URL.
   * @returns {Promise<string>} The file contents.
   */
  async fetchFileContents(url:string):Promise<string> {
    if (typeof url !== 'string') {
      throw new InvalidArgTypeError('url', 'string', url);
    } else if (url.length === 0) {
      throw new InvalidArgValueError('url', url, 'is invalid because an ' +
        'empty string was provided');
    }

    let data;
    this.log.info(
      `${ellipsify(`Download of ${blueify(underline(url))} has started`)}`
    );

    const response = await fetch(url);
    const body = await response.text();

    return body;
  }

  /**
   * Imports a file into the appropriate directory.
   * @param {string} url The string representation of a remote file URL.
   * @returns {Promise<string>} The file contents.
   */
  async importFileFromUrl(url:string):Promise<string> {
    if (typeof url !== 'string') {
      throw new InvalidArgTypeError('url', 'string', url);
    } else if (url.length === 0) {
      throw new InvalidArgValueError('url', url, 'is invalid because an ' +
        'empty string was provided');
    }

    const data = await this.fetchFileContents(url);
    const filepath = pathResolve(this.options.destDir, pathBasename(url));
    await writeFile(filepath, data);

    return data;
  }
}
