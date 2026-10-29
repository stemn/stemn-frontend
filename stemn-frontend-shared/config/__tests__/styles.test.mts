/**
 * The stylesheet conventions (styles.cjs) under Vite 8:
 *  - `*.module.(s)css` files are CSS modules: `<File>_<class>-<hash>` names, as-is keys,
 *    `@value x from "theme"` resolved through the alias
 *  - every other stylesheet is global: names untouched, side-effect imports kept
 *  - node_modules css is global
 * Run with `npm test` (Vitest).
 */
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const { scopedClassName, sassOptions } = require('../styles.cjs')

const write = (root: string, file: string, contents: string) => {
  mkdirSync(join(root, file, '..'), { recursive: true })
  writeFileSync(join(root, file), contents)
}

test('scopedClassName is <File>_<class>-<hash> and deterministic', () => {
  const file = join(import.meta.dirname, '../../src/misc/Changes/CommitChanges/FileChangeRow.module.css')
  const name = scopedClassName('fileChangeRow', file)
  assert.match(name, /^FileChangeRow_fileChangeRow-[\w-]{5}$/)
  assert.equal(scopedClassName('fileChangeRow', `${file}?used`), name)
  assert.notEqual(scopedClassName('other', file), name)
  assert.match(scopedClassName('toast', '/x/Toasts.web.module.scss'), /^Toasts-web_toast-[\w-]{5}$/)
})

test('stylesheets follow the *.module.(s)css convention under Vite', async () => {
  const root = mkdtempSync(join(tmpdir(), 'stemn-css-'))
  try {
    write(root, 'theme.module.css', '@value primary: rgb(1, 2, 3);\n@value warn: rgb(4, 5, 6);\n')
    write(
      root,
      'src/Button.module.css',
      '@value primary from "theme";\n.button { color: primary; }\n.button-big { font-size: 20px; }\n',
    )
    write(root, 'src/Panel.module.scss', '@value warn from "theme";\n.panel { .title { color: warn; } }\n')
    write(
      root,
      'src/app.global.scss',
      ':root { --theme-primary: rgb(1, 2, 3); }\n.layout-row { display: flex; }\n@import "./links.css";\n',
    )
    write(root, 'src/links.css', '.link-primary { color: var(--theme-primary); }\n')
    write(root, 'src/Popover.css', '.Popover { z-index: 100; }\n')
    write(root, 'node_modules/some-lib/style.css', '.lib-class { color: black; }\n')
    write(root, 'node_modules/some-lib/package.json', '{ "name": "some-lib", "version": "1.0.0" }')
    write(
      root,
      'src/main.js',
      [
        "import './app.global.scss'",
        "import './Popover.css'",
        "import 'some-lib/style.css'",
        "import button from './Button.module.css'",
        "import panel from './Panel.module.scss'",
        "export const classes = { button: button.button, buttonBig: button['button-big'], title: panel.title }",
      ].join('\n'),
    )

    const result = await build({
      root,
      logLevel: 'silent',
      configFile: false,
      resolve: { alias: [{ find: /^theme$/, replacement: join(root, 'theme.module.css') }] },
      css: {
        modules: { generateScopedName: scopedClassName },
        preprocessorOptions: { scss: sassOptions },
      },
      build: {
        write: false,
        minify: false,
        cssCodeSplit: false,
        lib: { entry: join(root, 'src/main.js'), formats: ['es'], fileName: 'main' },
      },
    })

    const outputs = (Array.isArray(result) ? result : [result]).flatMap((r: any) => r.output)
    const css = outputs
      .filter((o: any) => o.fileName.endsWith('.css'))
      .map((o: any) => o.source)
      .join('\n')
    const js = outputs
      .filter((o: any) => o.type === 'chunk')
      .map((o: any) => o.code)
      .join('\n')

    // CSS modules: hashed `<File>_<class>-<hash>`, @value resolved through the alias
    assert.match(css, /\.Button_button-[\w-]{5}\s*\{\s*color: rgb\(1, 2, 3\);/)
    assert.match(css, /\.Button_button-big-[\w-]{5}\s*\{/)
    assert.match(css, /\.Panel_panel-[\w-]{5} \.Panel_title-[\w-]{5}\s*\{\s*color: rgb\(4, 5, 6\);/)
    // as-is keys: classes.button and classes['button-big'] both exist
    assert.match(js, /"button-big":\s*"Button_button-big-[\w-]{5}"/)
    assert.match(js, /button:\s*"Button_button-[\w-]{5}"|"button":\s*"Button_button-[\w-]{5}"/)
    assert.doesNotMatch(css, /color: (primary|warn);/)

    // global stylesheets (side-effect imports, @import inside them): names untouched, kept
    assert.match(css, /\.layout-row\s*\{\s*display: flex;/)
    assert.match(css, /\.link-primary\s*\{\s*color: var\(--theme-primary\);/)
    assert.match(css, /\.Popover\s*\{\s*z-index: 100;/)

    // node_modules css is plain global css
    assert.match(css, /\.lib-class\s*\{/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
