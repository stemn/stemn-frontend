const path = require('path');
const fs = require('fs');
const pkg = require('../../package.json')

// We assume we are running this script from the root folder
const assetsPath = './release/mac';

const publishOsxReleaseFile = (tag) => {
  console.log('------------------------------------');
  console.log('Writing release.json to release.json');
  const data = {
    url: `https://github.com/Stemn/Stemn-Desktop/releases/download/v${tag}/Stemn-${tag}-mac.zip`,
    name: '',
    notes: '',
    pub_date: new Date().toISOString()
  };
  const releaseFilePath = path.join(assetsPath, 'release.json');
  fs.writeFileSync(releaseFilePath, JSON.stringify(data, null, '  '));
}

publishOsxReleaseFile(pkg.version);



////const GithubApi = require('./github/api_old.js');
//const path = require('path');
//const fs = require('fs');
//
//const repo  = 'https://github.com/Stemn/Stemn-Desktop';
//const token =  '06cf3a48521833c82b0246956c1b40a9c1c73365';
//const assetsPath = 'C:\\Users\\david\\repositories\\stemn-electron\\release';
//
//const githubApi = new GithubApi(repo, token);
//
//const publishOsxReleaseFile = ({build, options, updateUrl, transport}) => {
//  const data = {
//    url: updateUrl,
//    name: options.name || '',
//    notes: options.notes || '',
//    pub_date: new Date().toISOString()
//  };
//
//  const releaseFilePath = path.join(assetsPath, 'release.json');
//  fs.writeFileSync(releaseFilePath, JSON.stringify(data, null, '  '));
//
//  return transport.releaseFile(releaseFilePath, build)
//    .then((releaseUrl) => {
//      return releaseUrl;
//    });
//}
//
//publishOsxReleaseFile({
//  build: 'v0.0.12',
//  transport: githubApi,
//  updateUrl:  'https://github.com/Stemn/Stemn-Desktop/releases/download/untagged-70ee6385e8033aa0bdf1/Stemn-0.0.12-mac.zip',
//  options: {}
//
//});
