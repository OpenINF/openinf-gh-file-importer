/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */
import { Octokit } from '@octokit/rest';
import { Logger } from 'console-log-level';
interface GhFileImporterOpts {
    destDir: string;
    log?: Logger;
}
export declare class GhFileImporter {
    octokit: Octokit;
    options: GhFileImporterOpts;
    log: Logger;
    /**
     * Creates an instance of GhFileImporter.
     * @param {(GhFileImporterOpts | undefined)} options The options object.
     * @throws {InvalidArgValueError}
     * @returns {GhFileImporter}
     */
    constructor(opts: GhFileImporterOpts);
    /**
     * Validates a request to retrieve a path's metadata prior to doing so.
     * @param {string} owner The username associated with the repository.
     * @param {string} repo The repository name.
     * @param {!(string | undefined)} path The path to the file or folder.
     * @param {!(string | undefined)} ref The name of the commit/branch/tag.
     * @returns {Promise<Object>} An object containing the path metadata.
     */
    fetchPathMetadata(owner: string, repo: string, path?: (undefined | string), ref?: (undefined | string)): Promise<Object>;
    /**
     * Downloads a file from a remote GitHub repository and returns its contents.
     * @param {string} url The string representation of a remote file URL.
     * @returns {Promise<string>} The file contents.
     */
    fetchFileContents(url: string): Promise<string>;
    /**
     * Imports a file into the appropriate directory.
     * @param {string} url The string representation of a remote file URL.
     * @returns {Promise<string>} The file contents.
     */
    importFileFromUrl(url: string): Promise<string>;
}
export {};
