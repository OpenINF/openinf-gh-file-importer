<div align="center">

# @openinf/gh-file-importer

Utility that imports arbitrary files from remote GitHub repositories

<br />

[!['View on npm'][npm-badge--shields]][npm-badge-url]
!['TypeScript types: included'][types-included-badge]
[!['DeepScan grade'][deepscan-badge]][deepscan-url]
[!['License: MIT'][license-badge--shields]][license-badge-url]

</div>

<br />

_The high-level goal of `@openinf/gh-file-importer` is to serve as a Node.js
package containing a utility for **importing arbitrary files from remote GitHub
repos** allowing users to make use of them locally. As is the case with any
software project in continuous development, omissions and errors may exist, for
which contributions are welcome._

<br />

<div align="center">

[![Code Style: Prettier][prettier-badge]][prettier-url]
[![Commit Style: Conventional Commits][conventional-commits-badge]][conventional-commits-url]
[![Active Issues: DeepSource][deepsource-badge]][deepsource-url]
[![Chat on Matrix][matrix-badge--shields]][matrix-url]

</div>

<br />

---

<br />

## Installation

`@openinf/gh-file-importer` runs on Node.js and is available via `npm`.

```shell
npm install @openinf/gh-file-importer
```

## Usage

Import the `GhFileImporter` constructor based on your platform.

### Node.js

Install with `npm install @openinf/gh-file-importer`

```ts
import { GhFileImporter } from '@openinf/gh-file-importer';
```

## Options

Now instantiate your your API. All options are optional except for `destDir`, which is the location
where your files will be stored.

```ts
import { GhFileImporter } from '@openinf/gh-file-importer';

const DIR_TEMP = './tmp';

const ghFileImporter = new GhFileImporter({ destDir: DIR_TEMP });

await ghFileImporter.importContents('tc39', 'proposals', 'README.md');
```

**Note:** if needing to circumvent exceeding the GitHub API rate limit, be sure
to have an environment variable called `GITHUB_TOKEN` containing a
[GitHub person access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

### Logging

For custom logging, pass an object with `debug`, `info`, `warn`, and `error` methods as the `log` option.

```ts
const ghFileImporter = new GhFileImporter({
  destDir: DIR_TEMP,
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }
};
```

### Debug

The simplest way to receive debug information is to set the `log` client option to `console`.

```ts
const ghFileImporter = new GhFileImporter({
  destDir: DIR_TEMP,
  log: console,
});
```

If you like to support a configurable log level, we recommend using the
[`console-log-level`](https://github.com/watson/console-log-level) module.

```ts
const ghFileImporter = new GhFileImporter({
  destDir: DIR_TEMP,
  log: require("console-log-level")({ level: "info" }),
});
```

<br />

---

<br />

<a name="GhFileImporter"></a>

## GhFileImporter
**Kind**: global class  

* [GhFileImporter](#GhFileImporter)
    * [new GhFileImporter(options)](#new_GhFileImporter_new)
    * [.fetchMetadata(owner, repo, path, ref)](#GhFileImporter+fetchMetadata) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.fetchFileContents(owner, repo, path, ref)](#GhFileImporter+fetchFileContents) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.fetchFileContentsFromUrl(url)](#GhFileImporter+fetchFileContentsFromUrl) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.importContents(url)](#GhFileImporter+importContents) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.importContentsFromUrl(url)](#GhFileImporter+importContentsFromUrl) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_GhFileImporter_new"></a>

### new GhFileImporter(options)
Creates an instance of GhFileImporter.

**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 
- <code>InvalidPropertyValueError</code> 
- <code>MissingArgsError</code> 
- <code>MissingOptionError</code> 


| Param | Type | Description |
| --- | --- | --- |
| options | <code>GhFileImporterOptions</code> \| <code>undefined</code> | The options object. |

<a name="GhFileImporter+fetchMetadata"></a>

### ghFileImporter.fetchMetadata(owner, repo, path, ref) ⇒ <code>Promise.&lt;any&gt;</code>
Retrieves a repo or path's metadata.

**Kind**: instance method of [<code>GhFileImporter</code>](#GhFileImporter)  
**Returns**: <code>Promise.&lt;any&gt;</code> - An object containing the metadata repo or path's
 metadata.  
**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 
- <code>InvalidArgsNumberError</code> 

**See**: https://docs.github.com/en/rest/reference/repos#get-repository-content  

| Param | Type | Description |
| --- | --- | --- |
| owner | <code>string</code> | The username associated with the repository. |
| repo | <code>string</code> | The repository name. |
| path | <code>string</code> \| <code>undefined</code> | The path to the file or folder. |
| ref | <code>string</code> \| <code>undefined</code> | The name of the commit/branch/tag. |

<a name="GhFileImporter+fetchFileContents"></a>

### ghFileImporter.fetchFileContents(owner, repo, path, ref) ⇒ <code>Promise.&lt;string&gt;</code>
Retrieves a path's contents.

**Kind**: instance method of [<code>GhFileImporter</code>](#GhFileImporter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The file contents.  
**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 
- <code>InvalidArgsNumberError</code> 


| Param | Type | Description |
| --- | --- | --- |
| owner | <code>string</code> | The username associated with the repository. |
| repo | <code>string</code> | The repository name. |
| path | <code>string</code> | The path to the file or folder. |
| ref | <code>string</code> \| <code>undefined</code> | The name of the commit/branch/tag. |

<a name="GhFileImporter+fetchFileContentsFromUrl"></a>

### ghFileImporter.fetchFileContentsFromUrl(url) ⇒ <code>Promise.&lt;string&gt;</code>
Retrieves the file contents from the URL provided.

**Kind**: instance method of [<code>GhFileImporter</code>](#GhFileImporter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The file contents.  
**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The string representation of a remote file URL. |

<a name="GhFileImporter+importContents"></a>

### ghFileImporter.importContents(url) ⇒ <code>Promise.&lt;string&gt;</code>
Imports a file into the directory provided for the `destDir` option.

**Kind**: instance method of [<code>GhFileImporter</code>](#GhFileImporter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The file contents.  
**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The string representation of a remote file URL. |

<a name="GhFileImporter+importContentsFromUrl"></a>

### ghFileImporter.importContentsFromUrl(url) ⇒ <code>Promise.&lt;string&gt;</code>
Imports a file located at the supplied URL into the directory provided for
the `destDir` option.

**Kind**: instance method of [<code>GhFileImporter</code>](#GhFileImporter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The file contents.  
**Throws**:

- <code>InvalidArgTypeError</code> 
- <code>InvalidArgValueError</code> 


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The string representation of a remote file URL. |


<br />

---

<br />

<div align="center">

&copy; The OpenINF Authors

<br />

<a title="The OpenINF website" href="https://open.inf.is" rel="author">
  <img alt="The OpenINF logo" height="32px" width="32px" src="https://raw.githubusercontent.com/openinf/openinf.github.io/live/logo.svg?sanitize=true" />
</a>

</div>

<!-- prettier-ignore-start -->
<!-- PRESERVE LINK DEFINITION LABEL CASE - START -->

[deepscan-badge]: https://badgen.net/deepscan/grade/team/18447/project/21799/branch/634010?icon=deepscan
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18447&pid=21799&bid=634010
[deepsource-badge]: https://deepsource.io/gh/openinf/gh-file-importer.svg/?label=active+issues&show_trend=true&token=EDuWqCSX74CqsodrPKf1a6Jy
[deepsource-url]: https://deepsource.io/gh/openinf/gh-file-importer/?ref=repository-badge 'Active Issues: DeepSource'
[conventional-commits-badge]: https://img.shields.io/badge/commit%20style-Conventional-%23fa6673?logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggc3R5bGU9ImZpbGw6ICNGRkYiIGQ9Ik0xNSwyQTEzLDEzLDAsMSwxLDIsMTUsMTMsMTMsMCwwLDEsMTUsMm0wLTJBMTUsMTUsMCwxLDAsMzAsMTUsMTUsMTUsMCwwLDAsMTUsMFoiLz48L3N2Zz4K 'Commit Style: Conventional Commits'
[conventional-commits-url]: https://www.conventionalcommits.org 'Commit Style: Conventional Commits'
[license-badge-url]: https://spdx.org/licenses/MIT.html 'License: MIT'
[license-badge--shields]: https://img.shields.io/github/license/openinf/gh-file-importer?color=blue&logo=github 'License: MIT'
[matrix-badge--shields]: https://img.shields.io/badge/matrix-join%20chat-%2346BC99?logo=matrix 'Chat on Matrix'
[matrix-url]: https://matrix.to/#/#openinf:matrix.org 'You&apos;re invited to talk on Matrix'
[npm-badge--shields]: https://img.shields.io/npm/v/@openinf/gh-file-importer/latest.svg?logo=npm 'View on npm'
[npm-badge-url]: https://www.npmjs.com/package/@openinf/gh-file-importer#top 'View on npm'
[prettier-badge]: https://img.shields.io/badge/code_style-Prettier-ff69b4.svg?logo=prettier 'Code Style: Prettier'
[prettier-url]: https://prettier.io/playground 'Code Style: Prettier'
[types-included-badge]: https://badgen.net/npm/types/@openinf/gh-file-importer?icon=typescript 'TypeScript types: included'

<!-- PRESERVE LINK DEFINITION LABEL CASE - END -->
<!-- prettier-ignore-end -->
