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
  MissingOptionError,
} from '@openinf/util-errors';
import { fetch } from 'undici';
import { hasOwn } from '@openinf/util-object';
import { Octokit } from '@octokit/rest';
import { basename as pathBasename, resolve as pathResolve } from 'path';
import { writeFile } from 'fs/promises';
import log, { Logger } from 'console-log-level';

interface GhFileImporterOptions {
  destDir: string,
  log?: Logger
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export class GhFileImporter {
  octokit!:Octokit;
  options!:GhFileImporterOptions;
  log!:Logger;

  /**
   * Creates an instance of GhFileImporter.
   * @param {!(GhFileImporterOptions | undefined)} options The options object.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @throws {InvalidPropertyValueError}
   * @throws {MissingArgsError}
   * @throws {MissingOptionError}
   * @returns {GhFileImporter}
   */
  constructor(options:GhFileImporterOptions) {
    if (!hasOwn(options, 'destDir')) {
      throw new MissingOptionError('destDir');
    } else if (typeof options.destDir !== 'string') {
      throw new InvalidArgTypeError('options.destDir', 'string', options.destDir);
    } else if (options.destDir.length === 0) {
      throw new InvalidPropertyValueError('options', 'destDir',
        options.destDir,
        'is invalid because an empty string was provided');
    }

    this.log = options.log ? options.log : log({ level: 'info' });
    this.options = options; // Assign user-specified options.

    if (process.env.GITHUB_TOKEN) {
      // Use personal access token to prevent exceeding GitHub API rate limits.
      this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    } else {
      this.octokit = new Octokit({});
    }
  }

  /**
   * Retrieves a repo or path's metadata.
   * @see https://docs.github.com/en/rest/reference/repos#get-repository-content
   * @param {string} owner The username associated with the repository.
   * @param {string} repo The repository name.
   * @param {!(string | undefined)} path The path to the file or folder.
   * @param {!(string | undefined)} ref The name of the commit/branch/tag.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @throws {InvalidArgsNumberError}
   * @returns {Promise<any>} An object containing the metadata repo or path's
   *  metadata.
   */
  async fetchMetadata(
    owner:string,
    repo:string,
    path:(undefined | string) = undefined,
    ref:(undefined | string) = undefined
  ):Promise<any> {
    const args = Array.from(arguments);
    const argNames = ['owner', 'repo', 'path', 'ref'];
    const octokitOptsMap = new Map();

    args.forEach((value, index) => {
      switch (argNames[index]) {
        case 'owner':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'repo':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
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
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
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
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
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
   * Retrieves a path's contents.
   * @param {string} owner The username associated with the repository.
   * @param {string} repo The repository name.
   * @param {string} path The path to the file or folder.
   * @param {!(string | undefined)} ref The name of the commit/branch/tag.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @throws {InvalidArgsNumberError}
   * @returns {Promise<string>} The file contents.
   */
  async fetchFileContents(
    owner:string,
    repo:string,
    path:string,
    ref:(undefined | string) = undefined
  ):Promise<string> {
    const args = Array.from(arguments);
    const argNames = ['owner', 'repo', 'path', 'ref'];
    const octokitOptsMap = new Map();

    args.forEach((value, index) => {
      switch (argNames[index]) {
        case 'owner':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'repo':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'path':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
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
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          } else {
            octokitOptsMap.set(argNames[index], value);
          }
          break;
        default:
          throw new InvalidArgsNumberError('fetchPathMetadata', argNames.length,
            args.length);
      }
    });

    const res = await this.octokit.repos.getContent(Object.fromEntries(octokitOptsMap));
    const data = Object(res.data);

    const contentBuff = Buffer.from(data.content, 'base64');
    const contentText = contentBuff.toString('utf-8');

    return contentText;
  }

  /**
   * Retrieves the file contents from the URL provided.
   * @param {string} url The string representation of a remote file URL.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @returns {Promise<string>} The file contents.
   */
  async fetchFileContentsFromUrl(url:string):Promise<string> {
    if (typeof url !== 'string') {
      throw new InvalidArgTypeError('url', 'string', url);
    } else if (url.length === 0) {
      throw new InvalidArgValueError('url', url, 'is invalid because an ' +
        'empty string was provided');
    }

    this.log.info(
      `${ellipsify(`Download of ${blueify(underline(url))} has started`)}`
    );

    const response = await fetch(url);
    const body = await response.text();

    return body;
  }

  /**
   * Imports a file into the directory provided for the `destDir` option.
   * @param {string} url The string representation of a remote file URL.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @returns {Promise<string>} The file contents.
   */
  async importContents(
    owner:string,
    repo:string,
    path:string,
    ref:(undefined | string) = undefined
  ):Promise<string> {
    const args = Array.from(arguments);
    const argNames = ['owner', 'repo', 'path', 'ref'];
    const octokitOptsMap = new Map();

    args.forEach((value, index) => {
      switch (argNames[index]) {
        case 'owner':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'repo':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          }
          octokitOptsMap.set(argNames[index], value);
          break;
        case 'path':
          if (typeof value !== 'string') {
            throw new InvalidArgTypeError(argNames[index], 'string', value);
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
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
          } else if (value === '') {
            throw new InvalidArgValueError(argNames[index], 'string',
              'is invalid because an empty string was provided');
          } else {
            octokitOptsMap.set(argNames[index], value);
          }
          break;
        default:
          throw new InvalidArgsNumberError('fetchPathMetadata', argNames.length,
            args.length);
      }
    });

    const res = await this.octokit.repos.getContent(Object.fromEntries(octokitOptsMap));
    const data = Object(res.data);

    const contentBuff = Buffer.from(data.content, 'base64');
    const contentText = contentBuff.toString('utf-8');

    const filepath = pathResolve(this.options.destDir, path);
    await writeFile(filepath, contentText);

    return contentText;
  }

  /**
   * Imports a file located at the supplied URL into the directory provided for
   * the `destDir` option.
   * @param {string} url The string representation of a remote file URL.
   * @throws {InvalidArgTypeError}
   * @throws {InvalidArgValueError}
   * @returns {Promise<string>} The file contents.
   */
  async importContentsFromUrl(url:string):Promise<string> {
    if (typeof url !== 'string') {
      throw new InvalidArgTypeError('url', 'string', url);
    } else if (url.length === 0) {
      throw new InvalidArgValueError('url', url, 'is invalid because an ' +
        'empty string was provided');
    }

    const data = await this.fetchFileContentsFromUrl(url);
    const filepath = pathResolve(this.options.destDir, pathBasename(url));
    await writeFile(filepath, data);

    return data;
  }
}
