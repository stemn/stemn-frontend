/**************************************************
This application must be built using `npm run build`
before this script can be used.

run this with flags -windows || -linux || -mac
**************************************************/

"use strict"
const buildTypes = ['WINDOWS', 'LINUX', 'MAC'];
const builder = require("electron-builder")
const Platform = builder.Platform;

process.env.GH_TOKEN = '5e22e573ebfc575a4227e51cc5c8bf0808b94376'; // Github token to be used to publish the release: https://github.com/electron-userland/electron-builder/wiki/Publishing-Artifacts

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

// Get platforms from flags
const PlatformsToBuild = process.argv.slice(2).map(arg => arg.substring(1).toUpperCase()).filter(type => buildTypes.includes(type));
      
// If no flags, build for the current OS
if(!PlatformsToBuild || PlatformsToBuild.length < 1){
  if (/^win/.test(process.platform)) {
    console.log('No build type supplied: Building Windows');
    build('WINDOWS');
  } else if (/darwin/.test(process.platform)) {
    build('MAC');
  } else if (/linux/.test(process.platform)) {
    console.log('No build type supplied: Building Linux');
    build('LINUX');
  } else {
    console.error('No build type supplied. Include flag: -windows || -linux || -mac');
  }
}
else{
  console.log('Building: ', PlatformsToBuild);
  PlatformsToBuild.map(build);
}
