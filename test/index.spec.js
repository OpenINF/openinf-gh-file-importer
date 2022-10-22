/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */

const { GhFileImporter } = require("../lib/index.js");
const { mkdirSync, rmdirSync } = require("node:fs");
const { join } = require("node:path");
const tempy = require("tempy");

const URL_RAW_PROPOSALS_README =
  "https://raw.githubusercontent.com/tc39/proposals/HEAD/README.md";

tempy.directory.task(async (DIR_TEMP) => {
  const ghFileImporter = new GhFileImporter({ destDir: DIR_TEMP });

  let contents = await ghFileImporter.importContentsFromUrl(
    URL_RAW_PROPOSALS_README
  );
  console.log(contents + "\r\n\r\n");

  contents = await ghFileImporter.importContents(
    "tc39",
    "proposals",
    "README.md"
  );
  console.log(contents);
});
