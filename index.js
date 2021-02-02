"use strict";
/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhFileImporter = void 0;
// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------
const util_text_1 = require("@openinf/util-text");
const util_errors_1 = require("@openinf/util-errors");
const util_object_1 = require("@openinf/util-object");
const rest_1 = require("@octokit/rest");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const console_log_level_1 = __importDefault(require("console-log-level"));
const node_fetch_1 = __importDefault(require("node-fetch"));
// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------
class GhFileImporter {
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
    constructor(options) {
        if (!util_object_1.hasOwn(options, 'destDir')) {
            throw new util_errors_1.MissingOptionError('destDir');
        }
        else if (typeof options.destDir !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('options.destDir', 'string', options.destDir);
        }
        else if (options.destDir.length === 0) {
            throw new util_errors_1.InvalidPropertyValueError('options', 'destDir', options.destDir, 'is invalid because an empty string was provided');
        }
        this.log = options.log ? options.log : console_log_level_1.default({ level: 'info' });
        this.options = options; // Assign user-specified options.
        if (process.env.GITHUB_TOKEN) {
            // Use personal access token to prevent exceeding GitHub API rate limits.
            this.octokit = new rest_1.Octokit({ auth: process.env.GITHUB_TOKEN });
        }
        else {
            this.octokit = new rest_1.Octokit({});
        }
    }
    /* eslint-disable no-unused-vars */
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
    async fetchPathMetadata(owner, repo, path = undefined, ref = undefined) {
        /* eslint-enable no-unused-vars */
        const args = Array.from(arguments);
        const argNames = ['owner', 'repo', 'path', 'ref'];
        const octokitOptsMap = new Map();
        args.forEach((value, index) => {
            switch (argNames[index]) {
                case 'owner':
                    if (typeof value !== 'string') {
                        throw new util_errors_1.InvalidArgTypeError(argNames[index], 'string', value);
                    }
                    else if (value === '') {
                        throw new util_errors_1.InvalidArgValueError(argNames[index], 'string', 'is invalid because an empty string was provided');
                    }
                    octokitOptsMap.set(argNames[index], value);
                    break;
                case 'repo':
                    if (typeof value !== 'string') {
                        throw new util_errors_1.InvalidArgTypeError(argNames[index], 'string', value);
                    }
                    else if (value === '') {
                        throw new util_errors_1.InvalidArgValueError(argNames[index], 'string', 'is invalid because an empty string was provided');
                    }
                    octokitOptsMap.set(argNames[index], value);
                    break;
                case 'path':
                    if (value === undefined) {
                        this.log.debug(`The ${util_text_1.curlyQuote('path')} argument was missing and has been ` +
                            `omitted causing Octokit to use the repo root directory`);
                    }
                    else if (typeof value !== 'string') {
                        throw new util_errors_1.InvalidArgTypeError(argNames[index], 'string', value);
                    }
                    else if (value === '') {
                        throw new util_errors_1.InvalidArgValueError(argNames[index], 'string', 'is invalid because an empty string was provided');
                    }
                    else {
                        octokitOptsMap.set(argNames[index], value);
                    }
                    break;
                case 'ref':
                    if (value === undefined) {
                        this.log.debug(`The ${util_text_1.curlyQuote('ref')} argument was missing and has been ` +
                            `omitted causing Octokit to use the repo default branch ` +
                            `(often ${util_text_1.curlyQuote('main')})`);
                    }
                    else if (typeof value !== 'string') {
                        throw new util_errors_1.InvalidArgTypeError(argNames[index], 'string', value);
                    }
                    else if (value === '') {
                        throw new util_errors_1.InvalidArgValueError(argNames[index], 'string', 'is invalid because an empty string was provided');
                    }
                    else {
                        octokitOptsMap.set(argNames[index], value);
                    }
                    break;
                default:
                    throw new util_errors_1.InvalidArgsNumberError('fetchPathMetadata', argNames.length, args.length);
            }
        });
        return this.octokit.repos.getContent(Object.fromEntries(octokitOptsMap));
    }
    /**
     * Retrieves a GitHub repo's metadata.
     * @see https://docs.github.com/en/rest/reference/repos#get-a-repository
     * @param {string} owner The repo owner (username).
     * @param {string} repo The repo name.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<any>} An object containing the repo metadata.
     */
    async fetchRepoMetadata(owner, repo) {
        if (typeof owner !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('owner', 'string', owner);
        }
        else if (owner.length === 0) {
            throw new util_errors_1.InvalidArgValueError('owner', owner, 'is invalid because an ' +
                'empty string was provided');
        }
        else if (typeof repo !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('repo', 'string', repo);
        }
        else if (repo.length === 0) {
            throw new util_errors_1.InvalidArgValueError('repo', repo, 'is invalid because an ' +
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
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    async fetchFileContents(url) {
        if (typeof url !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('url', 'string', url);
        }
        else if (url.length === 0) {
            throw new util_errors_1.InvalidArgValueError('url', url, 'is invalid because an ' +
                'empty string was provided');
        }
        let data;
        this.log.info(`${util_text_1.ellipsify(`Download of ${util_text_1.blueify(util_text_1.underline(url))} has started`)}`);
        const response = await node_fetch_1.default(url);
        const body = await response.text();
        return body;
    }
    /**
     * Imports a file into the appropriate directory.
     * @param {string} url The string representation of a remote file URL.
     * @throws {InvalidArgTypeError}
     * @throws {InvalidArgValueError}
     * @returns {Promise<string>} The file contents.
     */
    async importFileFromUrl(url) {
        if (typeof url !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('url', 'string', url);
        }
        else if (url.length === 0) {
            throw new util_errors_1.InvalidArgValueError('url', url, 'is invalid because an ' +
                'empty string was provided');
        }
        const data = await this.fetchFileContents(url);
        const filepath = path_1.resolve(this.options.destDir, path_1.basename(url));
        await promises_1.writeFile(filepath, data);
        return data;
    }
}
exports.GhFileImporter = GhFileImporter;
