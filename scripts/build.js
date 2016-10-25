/**************************************************
This application must be built using `npm run build`
before this script can be used.

run this with flags -windows || -linux || -mac
**************************************************/

"use strict"
const buildTypes = ['WINDOWS', 'LINUX', 'MAC'];
const builder = require("electron-builder")
const Platform = builder.Platform;

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

const PlatformsToBuild = process.argv.slice(2).map(arg => arg.substring(1).toUpperCase()).filter(type => buildTypes.includes(type));
if(!PlatformsToBuild || PlatformsToBuild.length < 1){
  console.error('No build type supplied. Include flag: -windows || -linux || -mac’)
}
else{
  console.log('Building: ', PlatformsToBuild);
  PlatformsToBuild.map(build);
}
