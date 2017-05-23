const colors = require('colors')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const rootHtmlFolder = 'dist/renderer/assets/client/assets/html'

const instructions = [{
  path: 'dist/renderer/assets/html/main.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/main.js',
  ],
}, {
  path: 'dist/renderer/assets/html/menubar.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/menubar.js',
  ],
}, {
  path: 'dist/renderer/assets/html/preview.html',
  scripts: [
    '../../js/manifest.js',
    '../../js/vendor.js',
    '../../js/preview.js',
  ],
}]

instructions.forEach(({ path, scripts }) => {
  fs.readFileAsync(path, 'utf8').then((markup) => {
    const $ = cheerio.load(markup)
    // Remove the current scripts
    $('script').remove()
    // Add the new scripts
    scripts.forEach(script => $('body').append(`<script src="${script}"></script>\n`))
    // Wirte the file
    fs.writeFileAsync(path, $.html(), 'utf8')
    .catch(console.error)
    // Message
    console.log(`${path} updated`.green)
  }).catch(console.error)
})

