/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */

const { mkdirSync, rmdirSync } = require("fs");
const { GhFileImporter } = require("./index.js");

const DIR_TEMP = "./tmp";
const URL_RAW_PROPOSALS_README =
  "https://raw.githubusercontent.com/tc39/proposals/HEAD/README.md";

const ghFileImporter = new GhFileImporter({ destDir: DIR_TEMP });

rmdirSync(DIR_TEMP, { recursive: true });
mkdirSync(DIR_TEMP);

(async () => {
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
})();
