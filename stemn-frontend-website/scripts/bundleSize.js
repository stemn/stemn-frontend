// Measures the gzip size of the website's main chunks: what index.html loads before anything else (the entry script,
// its modulepreload chunks and the stylesheets). Lazy chunks (three.js, the CAD viewer, the diff viewer, ...) are not
// counted, so moving code behind import() keeps the number down.
//
//   node scripts/bundleSize.js            check build/client against bundle-size-baseline.json (fails above +2%)
//   node scripts/bundleSize.js --update   write the current size as the new baseline
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { gzipSync } = require('zlib')

const clientDir = join(__dirname, '../build/client')
const baselinePath = join(__dirname, '../bundle-size-baseline.json')
const tolerance = 0.02

const html = readFileSync(join(clientDir, 'index.html'), 'utf8')
const assets = [
  ...html.matchAll(/<script type="module"[^>]* src="(\/assets\/[^"]+)"/g),
  ...html.matchAll(/<link rel="modulepreload"[^>]* href="(\/assets\/[^"]+)"/g),
  ...html.matchAll(/<link rel="stylesheet"[^>]* href="(\/assets\/[^"]+)"/g),
].map((match) => match[1])

if (!assets.some((asset) => asset.endsWith('.js'))) {
  console.error('No entry script in build/client/index.html: run the Vite build first (npm run build)')
  process.exit(1)
}

const sizes = assets.map((asset) => {
  const data = readFileSync(join(clientDir, asset))
  return { asset, bytes: data.length, gzip: gzipSync(data, { level: 9 }).length }
})
const total = (filter) => sizes.filter(filter).reduce((sum, size) => sum + size.gzip, 0)
const current = {
  gzip: total(() => true),
  js: total((size) => size.asset.endsWith('.js')),
  css: total((size) => size.asset.endsWith('.css')),
  files: sizes.length,
}
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

sizes.sort((a, b) => b.gzip - a.gzip).forEach(({ asset, gzip }) => console.log(`${kb(gzip).padStart(10)}  ${asset}`))
console.log(
  `main chunks: ${current.files} files, ${kb(current.gzip)} gzip (js ${kb(current.js)}, css ${kb(current.css)})`,
)

if (process.argv.includes('--update')) {
  writeFileSync(
    baselinePath,
    `${JSON.stringify({ ...current, measured: new Date().toISOString().slice(0, 10) }, null, 2)}\n`,
  )
  console.log(`baseline written to ${baselinePath}`)
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))
  const limit = Math.floor(baseline.gzip * (1 + tolerance))
  const change = ((current.gzip / baseline.gzip - 1) * 100).toFixed(2)
  console.log(
    `baseline ${kb(baseline.gzip)} (${baseline.measured}), limit ${kb(limit)} (+${tolerance * 100}%): ${change}%`,
  )
  if (current.gzip > limit) {
    console.error(
      `The main chunks grew beyond the baseline + ${tolerance * 100}%. Load the new code lazily (import()), or if the` +
        ' growth is intended, update the baseline with `node scripts/bundleSize.js --update` and say why in the PR.',
    )
    process.exit(1)
  }
}
