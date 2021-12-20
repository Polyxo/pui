/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { colorsExporter } = require('@un/figma-connect');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

async function build() {
  /*rimraf.sync('./src');
   await fs.promises.mkdir('./src');*/
  colorsExporter({
    fileName: './src/wfpColors.js',
    fileNameMeta: './src/wfpColorsMeta.js',
  });
}

build().catch((error) => {
  console.log(error);
  process.exit(1);
});
