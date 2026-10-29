/**
 * Stylesheet conventions shared by every build of the shared code
 * (website: Vite + the webpack fallback, desktop: electron-vite).
 *
 *  - `*.module.(css|scss)` files are CSS modules, every other stylesheet is global CSS
 *    (the standard Vite / css-loader `auto` convention).
 *  - CSS-module class names are `<File>_<class>-<hash>` (e.g. `Button_primary-Ab3x_`), the same
 *    in every bundler. The hash is derived from the repo-relative path, so builds are reproducible.
 *  - Sass (Dart Sass, modern API) with the deprecation warnings of the legacy stylesheets silenced.
 *
 * CommonJS so that the webpack config (CommonJS) and the Vite configs (ESM) can both load it.
 */
const { createHash } = require('node:crypto')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '../..')

const MODULE_RE = /\.module\.(css|scss|sass)$/

/** CSS-module class name for `localName` in the stylesheet `filePath` (absolute, may carry a ?query) */
function scopedClassName(localName, filePath) {
  const file = filePath.split('?')[0]
  const base = path.basename(file).replace(MODULE_RE, '').replace(/\.(css|scss|sass)$/, '').replace(/\./g, '-')
  const relative = path.relative(repoRoot, file).split(path.sep).join('/')
  const hash = createHash('sha256').update(`${relative}:${localName}`).digest('base64url').slice(0, 5)
  return `${base}_${localName}-${hash}`
}

/** Dart Sass options (same for sass-loader `sassOptions` and Vite `css.preprocessorOptions.scss`) */
const sassOptions = {
  quietDeps: true,
  silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'legacy-js-api'],
}

module.exports = { MODULE_RE, scopedClassName, sassOptions }
