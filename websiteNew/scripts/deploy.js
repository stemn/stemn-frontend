const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const SSH = require('ssh-promise')
const exec = require('child-process-promise').exec
const rimrafAsync = Promise.promisify(require('rimraf'))
/*********************************************************
This script will deploy the stemn website. It should be
run from the root website folder using `npm run deploy`.

What it does:
1. Copies the dist to the 'stemn-website-live' folder.
   This repo must be located at '../../stemn-website-live'
2. Pushes this repo
3. SSHs into the server, pulls the repo

*********************************************************/

const joinCommands = commands => commands.join(' && ')

const config = {
  repo: {
    name: 'stemn-website-live',
  },
  ssh: {
    host: '35.167.249.144',
    username: 'ubuntu',
    key: fs.readFileSync(path.join('../../stemn-api/aws/keys', 'stemn.prv')),
  },
  commitMessage: 'automated deployment',
}

const pushDist = () => {
  const commands1 = [
    `cd ../../${config.repo.name}`,
    'git pull',
//    'git ls-files --deleted -z | xargs -0 git rm',
    'git add .',
    `git commit -m "${config.commitMessage}"`,
  ]
  // Commit will throw an error if we commit no files.
  // The push is therfore broken into another series of commands
  // where it can be run on 'then' or 'catch'.
  const commands2 = [
    `cd ../../${config.repo.name}`,
    'git push',
  ]
  return exec(joinCommands(commands1))
    .then(() => exec(joinCommands(commands2)))
    .catch(() => exec(joinCommands(commands2)))
}

const copyDist = () => {
  // Create the destination folder if it doesn't exist
  const desintation = `../../${config.repo.name}/client`
  if (!fs.existsSync(desintation)) {
    fs.mkdirSync(desintation)
  }
  return fs.copyAsync('./build/client', desintation)
}
const removeExisting = () => rimrafAsync(`../../${config.repo.name}/client`)

const log = (result) => {
  console.log('stdout: ', result.stdout)
  console.log('stderr: ', result.stderr)
  return result
}

// Go time
removeExisting()
.then(copyDist)
.then(pushDist)
.catch(console.error)
