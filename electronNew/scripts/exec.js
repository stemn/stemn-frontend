// This scripts is used by running:
// `node ./exec.js ./some-shell-script.sh`

const bashPath = '"C:\\Program Files\\Git\\bin\\sh.exe"'
// "C:\Program Files\Git\bin\sh.exe" --login -i -c "./release.sh"

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const [ nodePath, thisPath, scriptPath ] = process.argv
const scriptFullPath = path.join(process.cwd(), scriptPath)
console.log(scriptFullPath);
//exec(scriptFullPath, (error, stdout, stderr) => {
//  console.log('stdout: ' + stdout)
//  console.log('stderr: ' + stderr)
//  if (error !== null) {
//    console.log('exec error: ' + error)
//  }
//})
//
//
//
