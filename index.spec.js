/**
 * @license
 * Copyright OpenINF All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://open.inf.is/license
 */

const { mkdirSync, rmdirSync } = require('fs');
const { GhFileImporter } = require('./index.js');

const DIR_TEMP = './tmp';
const URL_RAW_PROPOSALS_README =
  'https://raw.githubusercontent.com/tc39/proposals/HEAD/README.md';

const ghFileImporter = new GhFileImporter({ destDir: DIR_TEMP });

rmdirSync(DIR_TEMP, { recursive: true });
mkdirSync(DIR_TEMP);

(async () => {
  const contents = await ghFileImporter.importFileFromUrl(URL_RAW_PROPOSALS_README);
  console.log(contents);
})();
