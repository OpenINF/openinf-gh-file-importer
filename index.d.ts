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
    fetchMetadata(owner: string, repo: string, path?: (undefined | string), ref?: (undefined | string)): Promise<any>;
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
    fetchFileContents(owner: string, repo: string, path: string, ref?: (undefined | string)): Promise<string>;
    /**
     * Retrieves the file contents from the URL provided.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    fetchFileContentsFromUrl(url: string): Promise<string>;
    /**
     * Imports a file into the directory provided for the `destDir` option.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    importContents(owner: string, repo: string, path: string, ref?: (undefined | string)): Promise<string>;
    /**
     * Imports a file located at the supplied URL into the directory provided for
     * the `destDir` option.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    importContentsFromUrl(url: string): Promise<string>;
}
export {};
