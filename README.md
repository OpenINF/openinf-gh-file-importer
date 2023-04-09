[![Orange banner indicating a preview software component][release-level-banner--unstable]](#)

<div align="center">

## @openinf/gh-file-importer

Utility that imports arbitrary files from remote GitHub repositories

<br />

[!['View on npm'][npm-badge--shields]][npm-badge-url]
[!['License: MIT/Apache-2.0'][license-badge--shields]][license-badge-url]

</div>

<br />

_The high-level goal of `@openinf/gh-file-importer` is to serve as a Node.js
package containing a utility for **importing arbitrary files from remote GitHub
repos** allowing users to make use of them locally. As is the case with any
software project in continuous development, omissions and errors may exist, for
which [contributions are welcome](#contributing)._

<br />

<details id="platform--node-js-lts">
	<summary>
		<a
			href="#platform--node-js-lts"
			title="Platform: Node.js LTS"
		>
			<img
				src="https://img.shields.io/badge/Node.js-LTS-black?logo=Node.js&logoColor=lightgreen&color=2a2a2a&labelColor=black"
				alt="Platform: Node.js LTS"
			/>
		</a>
	</summary>
	<div align="left"><br />
		<a
			target="_blank"
			title="Node.js release schedule"
			href="https://github.com/nodejs/release#release-schedule"
		>
			<strong>Supported Node.js Environments</strong>
		</a><br /><br />

- [ ] v4：Argon (Ar)
- [ ] v6：Boron (B)
- [ ] v8：Carbon (C)
- [ ] v10：Dubnium (Db)
- [ ] v12：Erbium (Er)
- [x] v14：Fermium (Fm)
- [x] v16：Gallium (Ga)
- [x] v18：Hydrogen (H)
<!-- TODO
- [x] v20: Iron (Fe) -->

</div></details>

<br />

<div align="center">

[![Code Style: Prettier][prettier-badge]][prettier-url]
[![Commit Style: Conventional Commits][conventional-commits-badge]][conventional-commits-url]
[![Chat on Matrix][matrix-badge--shields]][matrix-url]

</div>

<br /><br />

---

<br />

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

<br /><br />

---

<br />

### Installation

`@openinf/gh-file-importer` runs on
[supported versions of Node.js](#platform--node-js-lts) and is available via
**`npm`**, **`pnpm`**, or **`yarn`**.

**Using the npm CLI**

<sup>See the
[official documentation for this command](https://docs.npmjs.com/cli/commands/npm-install)
for more information.</sup>

```shell
npm i @openinf/gh-file-importer
```

**Using the pnpm CLI**

<sup>See the
[official documentation for this command](https://pnpm.io/cli/add) for more
information.</sup>

```shell
pnpm add @openinf/gh-file-importer
```

**Using the Yarn 1 CLI (Classic)**

<sup>See the
[official documentation for this command](https://classic.yarnpkg.com/en/docs/cli/add)
for more information.</sup>

```shell
yarn add @openinf/gh-file-importer
```

<br /><br />

### Usage

Import the `GhFileImporter` constructor based on your platform.

#### Node.js

```ts
import { GhFileImporter } from '@openinf/gh-file-importer';
```

#### Options

Now instantiate your API. All options are optional except for `destDir`, which is the location
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

#### Logging

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

#### Debug

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

<br /><br />

### API

<a name="GhFileImporter"></a>

### GhFileImporter
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

<br /><br />

---

<br />

### Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change. If for whatever reason you spot something
to fix but cannot patch it yourself, please [open an issue][].

<br />

### License

This project is licensed under either of

- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [MIT license](https://opensource.org/licenses/MIT)

at your option.

The [SPDX](https://spdx.dev) license identifier for this project is
`MIT OR Apache-2.0`.

<br /><br />

---

<br />

<div align="center">

### Show Your Support

<br />

If you like the project (or want to bookmark it)&nbsp;&mdash;<br />
&mdash;&nbsp;[give it a star ⭐️][]&nbsp;&mdash;&nbsp;it will greatly encourage
us.

<br /><br />

&copy; The OpenINF Authors

<br />

<a title="The OpenINF website" href="https://open.inf.is" rel="author">
  <img alt="The OpenINF logo" height="32px" width="32px" src="https://raw.githubusercontent.com/openinf/openinf.github.io/live/assets/img/svg/logo.svg?sanitize=true" />
</a>

</div>

<br /><br />

[![Orange banner indicating a preview software component][release-level-banner--unstable]](#)

<!-- BEGIN LINK DEFINITIONS -->
[conventional-commits-badge]: https://img.shields.io/badge/commit%20style-Conventional-%23fa6673?logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggc3R5bGU9ImZpbGw6ICNGRkYiIGQ9Ik0xNSwyQTEzLDEzLDAsMSwxLDIsMTUsMTMsMTMsMCwwLDEsMTUsMm0wLTJBMTUsMTUsMCwxLDAsMzAsMTUsMTUsMTUsMCwwLDAsMTUsMFoiLz48L3N2Zz4K 'Commit Style: Conventional Commits'
[conventional-commits-url]: https://www.conventionalcommits.org 'Commit Style: Conventional Commits'
[give it a star ⭐️]: https://github.com/OpenINF/openinf-gh-file-importer/stargazers
[license-badge--shields]: https://img.shields.io/badge/license-MIT%2FApache--2.0-blue.svg?logo=github 'License: MIT/Apache 2.0'
[license-badge-url]: #license 'License: MIT/Apache 2.0'
[matrix-badge--shields]: https://img.shields.io/badge/matrix-join%20chat-%2346BC99?logo=matrix 'Chat on Matrix'
[matrix-url]: https://matrix.to/#/#openinf:matrix.org 'You&apos;re invited to talk on Matrix'
[npm-badge--shields]: https://img.shields.io/npm/v/@openinf/gh-file-importer/latest.svg?logo=npm&color=fe7d37 'View on npm'
[npm-badge-url]: https://www.npmjs.com/package/@openinf/gh-file-importer#top 'View on npm'
[open an issue]: https://github.com/OpenINF/openinf-gh-file-importer/issues
[prettier-badge]: https://img.shields.io/badge/code_style-Prettier-ff69b4.svg?logo=prettier 'Code Style: Prettier'
[prettier-url]: https://prettier.io/playground 'Code Style: Prettier'
[release-level-banner--unstable]: https://raw.githubusercontent.com/OpenINF/openinf.github.io/live/assets/img/svg/release-level-banner--unstable.svg?sanitize=true 'Banner for Release Level: Unstable'
<!-- END LINK DEFINITIONS -->
