/**************************************************
This application must be built using `npm run build`
before this script can be used.
**************************************************/

"use strict"
//const buildTypes = ['WINDOWS', 'LINUX', '0SX'];
//const buildTypes = ['WINDOWS'];
//const buildTypes = ['LINUX'];
const buildTypes = ['OSX'];

const builder = require("electron-builder")
const Platform = builder.Platform;

// platform = 'WINDOWS' 'LINUX' 'OSX
const build = (platform) => {
  builder.build({
    targets: Platform[platform].createTarget(),
    devMetadata: {
      "//": "build and other properties, see https://goo.gl/5jVxoO"
    }
  })
  .catch((error) => {
    console.error(error);
  })
}

 buildTypes.map(build);
