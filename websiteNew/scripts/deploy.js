const fs = require('fs')
const path = require('path')
const SSH = require('ssh-promise')
const exec = require('child-process-promise').exec

const config = {
  repo: {
    name : 'stemn-website-live'
  },
  ssh: {
    host: '35.167.249.144',
    username: 'ubuntu',
    key : fs.readFileSync(path.join('../../stemn-api/aws/keys', 'stemn.prv')),
  },
  commitMessage : 'automated deployment',
}

const ssh = new SSH({
    host: config.ssh.host,
    username: config.ssh.username,
    privateKey: config.ssh.key
})

const build = () => exec('brunch build')
const add = () => exec('git add .')
const commit = () => exec(`git commit -am "${config.commitMessage}"`).catch(() => {})
const pull = () => exec('git pull')
const push = () => exec('git push')

const deployToServer = () => {
    const commands = [
        `cd repositories ${config.repo.name}`,
        'git pull',
        'npm install',
    ].join('; ');

    return ssh.exec(commands);
}

add()
.then(commit)
//.then(pull)
//.then(build)
//.then(add)
//.then(commit)
//.then(push)
//.then(deployToServer);
