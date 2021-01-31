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
     * @param {(GhFileImporterOpts | undefined)} options The options object.
     * @throws {InvalidArgValueError}
     * @returns {GhFileImporter}
     */
    constructor(opts) {
        // TODO: Somehow validate the options passed in better.
        if (opts === undefined) {
        }
        else if (typeof opts.destDir !== 'string') {
            throw new util_errors_1.InvalidArgTypeError('opts.destDir', 'string', opts.destDir);
        }
        else if (opts.destDir.length === 0) {
            throw new util_errors_1.InvalidPropertyValueError('opts', 'destDir', opts.destDir, 'is invalid because an empty string was provided');
        }
        this.log = opts.log ? opts.log : console_log_level_1.default({ level: 'info' });
        this.options = opts; // Assign user-specified options.
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
     * Validates a request to retrieve a path's metadata prior to doing so.
     * @param {string} owner The username associated with the repository.
     * @param {string} repo The repository name.
     * @param {!(string | undefined)} path The path to the file or folder.
     * @param {!(string | undefined)} ref The name of the commit/branch/tag.
     * @returns {Promise<Object>} An object containing the path metadata.
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
                    octokitOptsMap.set(argNames[index], value);
                    break;
                case 'repo':
                    if (typeof value !== 'string') {
                        throw new util_errors_1.InvalidArgTypeError(argNames[index], 'string', value);
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
     * Downloads a file from a remote GitHub repository and returns its contents.
     * @param {string} url The string representation of a remote file URL.
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
