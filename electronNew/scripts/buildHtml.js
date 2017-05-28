const colors = require('colors')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const instructions = [{
  path: 'dist/renderer/static/html/main.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/main.js',
  ],
  links: [
    '../../css/vendor.css',
    '../../css/main.css',
  ],
}, {
  path: 'dist/renderer/static/html/menubar.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/menubar.js',
  ],
  links: [
    '../../css/vendor.css',
    '../../css/menubar.css',
  ],
}, {
  path: 'dist/renderer/static/html/preview.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/preview.js',
  ],
  links: [
    '../../css/vendor.css',
    '../../css/preview.css',
  ],
}]

instructions.forEach(({ path, scripts, links }) => {
  fs.readFileAsync(path, 'utf8').then((markup) => {
    const $ = cheerio.load(markup)
    // Remove the current scripts
    $('script').remove()
    // Add the new scripts
    scripts.forEach(script => $('body').append(`<script src="${script}"></script>\n`))
    // Add the new links
    links.forEach(link => $('head').append(`<link rel="stylesheet" href="${link}">\n`))
    // Wirte the file
    fs.writeFileAsync(path, $.html(), 'utf8')
    .catch(console.error)
    // Message
    console.log(`${path} updated`.green)
  }).catch(console.error)
})

