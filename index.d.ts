/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */
import { Octokit } from '@octokit/rest';
import { Logger } from 'console-log-level';
interface GhFileImporterOptions {
    destDir: string;
    log?: Logger;
}
export declare class GhFileImporter {
    octokit: Octokit;
    options: GhFileImporterOptions;
    log: Logger;
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
    constructor(options: GhFileImporterOptions);
    /**
     * Retrieves a path's metadata.
     * @param {string} owner The username associated with the repository.
     * @param {string} repo The repository name.
     * @param {!(string | undefined)} path The path to the file or folder.
     * @param {!(string | undefined)} ref The name of the commit/branch/tag.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @throws {InvalidArgsNumberError}
     * @returns {Promise<any>} An object containing the path metadata.
     */
    fetchPathMetadata(owner: string, repo: string, path?: (undefined | string), ref?: (undefined | string)): Promise<any>;
    /**
     * Retrieves a GitHub repo's metadata.
     * @see https://docs.github.com/en/rest/reference/repos#get-a-repository
     * @param {string} owner The repo owner (username).
     * @param {string} repo The repo name.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<any>} An object containing the repo metadata.
     */
    fetchRepoMetadata(owner: string, repo: string): Promise<any>;
    /**
     * Downloads a file from a remote GitHub repository and returns its contents.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    fetchFileContents(url: string): Promise<string>;
    /**
     * Imports a file into the appropriate directory.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    importFileFromUrl(url: string): Promise<string>;
}
export {};
