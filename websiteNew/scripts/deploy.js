const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const SSH = require('ssh-promise')
const exec = require('child-process-promise').exec

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

const ssh = new SSH({
  host: config.ssh.host,
  username: config.ssh.username,
  privateKey: config.ssh.key,
})

// Scripts

const pullDist = () => ssh.exec(`
  cd ~/repositories/${config.repo.name};
  git pull;
`)

const pushDist = () => exec(`
  cd ../../${config.repo.name};
  git pull;
  git add .;
  git commit -am "${config.commitMessage}";
  git push;
`)

const copyDist = () => fs.copyAsync('./build/client', `../../${config.repo.name}`)

const log = (result) => {
  console.log('stdout: ', result.stdout)
  console.log('stderr: ', result.stderr)
  return result
}

// Go time

copyDist()
.then(pushDist)
.then(pullDist)
.catch(console.error)

