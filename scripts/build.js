"use strict"

const builder = require("electron-builder")
const Platform = builder.Platform
//const buildTypes = ['WINDOWS', 'LINUX'];
//const build = (platform) => {
//  //platform = 'WINDOWS' 'LINUX' 'OSX
//  builder.build({
//    targets: Platform[platform].createTarget(),
//    devMetadata: {
//      "//": "build and other properties, see https://goo.gl/5jVxoO"
//    }
//  })
//  .catch((error) => {
//    console.error(error);
//  })
//}
//

// buildTypes.map(build);

  builder.build({
    targets: Platform.WINDOWS.createTarget(),
    devMetadata: {
      "//": "build and other properties, see https://goo.gl/5jVxoO"
    }
  })
  .catch((error) => {
    console.error(error);
  })
