/**
 * Stemn CSS-modules convention for Vite.
 *
 * The codebase was written for css-loader with this rule (see
 * stemn-frontend-website/config/webpack.config.base.js):
 *
 *   - every `.css` / `.scss` file in the app and shared source directories is a
 *     CSS module, EXCEPT
 *   - `*.global.(css|scss)` files and the shared global stylesheets
 *     (`stemn-shared/assets/css/**`), which are plain global CSS
 *   - anything in node_modules is plain global CSS
 *
 * Vite only treats `*.module.(css|scss)` ids as CSS modules and has no
 * `modules.auto` callback, so this plugin rewrites the *resolved id* of every
 * stylesheet under the configured source directories to
 *
 *   /abs/path/Foo.scss?stemn-css.module.css
 *
 * The file on disk is untouched: Vite loads ids by their path without the
 * query, the CSS plugin picks the preprocessor from the real extension
 * (`.scss`), and the trailing `.module.css` in the query satisfies Vite's
 * `\.module\.(css|...)` check, so the file goes through Vite's own
 * postcss-modules pipeline.
 *
 * Global stylesheets go through the same pipeline with an identity
 * `generateScopedName`. That keeps their class names global but still
 * evaluates `@value primary from "theme"` (the website does the same with
 * css-loader's `mode: 'global'`). Vite passes its alias-aware resolver to
 * postcss-modules, so `"theme"` resolves through `resolve.alias`.
 *
 * Class names are exported as-is (`classes.foo`, `classes['foo-bar']`), the
 * same as css-loader's `exportLocalsConvention: 'as-is'` on the website.
 */
import { createHash } from 'node:crypto'
import path from 'node:path'
import type { Plugin } from 'vite'

export const MODULE_QUERY = 'stemn-css.module.css'

const STYLESHEET_RE = /\.(css|scss|sass)$/
const GLOBAL_FILE_RE = /\.global\.(css|scss|sass)$/

export interface StemnCssModulesOptions {
  /** Absolute directories whose stylesheets follow the convention */
  include: string[]
  /** Absolute directories whose stylesheets are always global */
  globalDirs?: string[]
  /** Pattern for local class names. [name] = file name, [local] = class, [hash] = 5 char hash */
  localIdentName?: string
}

const withSep = (dir: string) => (dir.endsWith(path.sep) ? dir : dir + path.sep)
const stripQuery = (id: string) => id.split('?')[0]

export const createStemnCssModules = (options: StemnCssModulesOptions) => {
  const include = options.include.map(withSep)
  const globalDirs = (options.globalDirs || []).map(withSep)
  const localIdentName = options.localIdentName || '[name]_[local]-[hash]'

  const isConventionStylesheet = (file: string) => STYLESHEET_RE.test(file)
    && !file.includes(`${path.sep}node_modules${path.sep}`)
    && include.some((dir) => file.startsWith(dir))

  const isGlobalStylesheet = (file: string) => GLOBAL_FILE_RE.test(file)
    || globalDirs.some((dir) => file.startsWith(dir))

  const generateScopedName = (name: string, filename: string) => {
    const file = stripQuery(filename)
    if (isGlobalStylesheet(file)) {
      return name
    }
    const baseName = path.basename(file).replace(/\.(css|scss|sass)$/, '').replace(/\./g, '-')
    const hash = createHash('sha256').update(`${file}:${name}`).digest('base64url').slice(0, 5)
    return localIdentName
      .replace('[name]', baseName)
      .replace('[local]', name)
      .replace('[hash]', hash)
  }

  const plugin: Plugin = {
    name: 'stemn-css-modules',
    enforce: 'pre',
    config() {
      // localsConvention is left unset: keys exactly as written (classes.foo / classes['foo-bar'])
      return { css: { modules: { generateScopedName } } }
    },
    async resolveId(source, importer, resolveOptions) {
      // Leave explicit queries (?inline, ?url, ?raw...) and non-stylesheets alone
      if (!importer || source.includes('?') || !STYLESHEET_RE.test(source)) {
        return null
      }
      const resolved = await this.resolve(source, importer, { ...resolveOptions, skipSelf: true })
      if (!resolved || resolved.external || resolved.id.includes('?') || !isConventionStylesheet(resolved.id)) {
        return resolved
      }
      return { ...resolved, id: `${resolved.id}?${MODULE_QUERY}` }
    },
  }

  /**
   * Vite marks CSS-module JS as side-effect free, so a stylesheet imported only
   * for its side effects (`import './index.global.scss'`) would be tree-shaken
   * away together with its CSS. css-loader never dropped imported CSS, so keep
   * every rewritten stylesheet.
   */
  const keepPlugin: Plugin = {
    name: 'stemn-css-modules:keep',
    enforce: 'post',
    transform(code, id) {
      if (!id.endsWith(`?${MODULE_QUERY}`)) return null
      return { code, map: null, moduleSideEffects: 'no-treeshake' }
    },
  }

  return { plugins: [plugin, keepPlugin], isGlobalStylesheet, isConventionStylesheet, generateScopedName }
}

/** Vite plugins: rewrite stylesheet ids, set the matching `css.modules.generateScopedName`, keep side-effect imports */
export default function stemnCssModules(options: StemnCssModulesOptions): Plugin[] {
  return createStemnCssModules(options).plugins
}
