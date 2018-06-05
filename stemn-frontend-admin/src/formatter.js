const Promise = require('bluebird')
const flatten = require('lodash.flatten')
const groupby = require('lodash.groupby')
const compact = require('lodash.compact')
const uniq = require('lodash.uniqwith')
const util = require('util')
const fs = require('fs')

const readdir = Promise.promisify(fs.readdir)
const readFile = Promise.promisify(fs.readFile)

return readdir('.').then((files) => {
  const filenames = files.filter(filename => filename.includes('because'))
  return Promise.map(filenames, filename => readFile(`./${filename}`, 'utf-8').then(content => JSON.parse(content.toString())))
})
  .then(flatten)
  .then((contacts) => {
    const transformed = flatten(contacts.map((item) => {
      const emails = item.emails
      const url = `https://github.com/${item.repo}`
      const messages = compact(emails.map(email => (email.email.includes('noreply')
        ? undefined
        : {
          name: email.name,
          firstname: email.name.split(' ')[0],
          email: email.email,
          owner: item.repo.split('/')[0],
          repo: item.repo.split('/')[1],
          url,
        })))
      return messages
    }))

    const recipients = groupby(transformed, 'email')

    const emails = Object.keys(recipients)

    const results = emails.map((email) => {
      const projects = recipients[email]
      return projects[0]
    })

    results.forEach((email) => {
      console.log(`${email.firstname}, ${email.email}, ${email.repo}, ${email.url}`)
    })
  })
