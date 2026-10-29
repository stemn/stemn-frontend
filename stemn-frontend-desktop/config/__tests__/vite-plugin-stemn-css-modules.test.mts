/**
 * Proves the CSS-modules convention plugin works with Vite 8:
 *  - plain `.css` / `.scss` files are CSS modules (hashed names, as-is keys)
 *  - `.global.` files keep their class names but still evaluate `@value x from "theme"`
 *  - stylesheets imported only for side effects are not tree-shaken
 *  - node_modules css is left alone
 * Run with `npm test` (node --test).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
import stemnCssModules from '../vite-plugin-stemn-css-modules.mts'

const write = (root: string, file: string, contents: string) => {
  mkdirSync(join(root, file, '..'), { recursive: true })
  writeFileSync(join(root, file), contents)
}

test('stylesheets follow the css-loader convention under Vite', async () => {
  const root = mkdtempSync(join(tmpdir(), 'stemn-css-'))
  try {
    write(root, 'theme.css', '@value primary: rgb(1, 2, 3);\n@value warn: rgb(4, 5, 6);\n')
    write(root, 'src/Button.css', '@value primary from "theme";\n.button { color: primary; }\n.button-big { font-size: 20px; }\n')
    write(root, 'src/Panel.scss', '@value warn from "theme";\n.panel { .title { color: warn; } }\n')
    write(root, 'src/app.global.scss', '@value primary from "theme";\n.layout-row { display: flex; }\n.link-primary { color: primary; }\n')
    write(root, 'src/assets/css/links.css', '@value warn from "theme";\n.link-warn { color: warn; }\n')
    write(root, 'node_modules/some-lib/style.css', '.lib-class { color: black; }\n')
    write(root, 'src/main.js', [
      "import './app.global.scss'",
      "import './assets/css/links.css'",
      "import 'some-lib/style.css'",
      "import button from './Button.css'",
      "import panel from './Panel.scss'",
      "export const classes = { button: button.button, buttonBig: button['button-big'], title: panel.title }",
    ].join('\n'))
    write(root, 'node_modules/some-lib/package.json', '{ "name": "some-lib", "version": "1.0.0" }')

    const result = await build({
      root,
      logLevel: 'silent',
      configFile: false,
      resolve: { alias: [{ find: /^theme$/, replacement: join(root, 'theme.css') }] },
      plugins: [stemnCssModules({ include: [join(root, 'src')], globalDirs: [join(root, 'src/assets/css')] })],
      build: {
        write: false,
        minify: false,
        cssCodeSplit: false,
        lib: { entry: join(root, 'src/main.js'), formats: ['es'], fileName: 'main' },
      },
    })

    const outputs = (Array.isArray(result) ? result : [result]).flatMap((r: any) => r.output)
    const css = outputs.filter((o: any) => o.fileName.endsWith('.css')).map((o: any) => o.source).join('\n')
    const js = outputs.filter((o: any) => o.type === 'chunk').map((o: any) => o.code).join('\n')

    // CSS modules: hashed, `[name]_[local]-[hash]`, @value resolved through the alias
    assert.match(css, /\.Button_button-[\w-]{5}\s*\{\s*color: rgb\(1, 2, 3\);/)
    assert.match(css, /\.Button_button-big-[\w-]{5}\s*\{/)
    assert.match(css, /\.Panel_panel-[\w-]{5} \.Panel_title-[\w-]{5}\s*\{\s*color: rgb\(4, 5, 6\);/)
    // as-is keys: classes.button and classes['button-big'] both exist
    assert.match(js, /"button-big":\s*"Button_button-big-[\w-]{5}"/)
    assert.match(js, /button:\s*"Button_button-[\w-]{5}"|"button":\s*"Button_button-[\w-]{5}"/)

    // global stylesheets: names untouched, @value still evaluated, side-effect imports kept
    assert.match(css, /\.layout-row\s*\{\s*display: flex;/)
    assert.match(css, /\.link-primary\s*\{\s*color: rgb\(1, 2, 3\);/)
    assert.match(css, /\.link-warn\s*\{\s*color: rgb\(4, 5, 6\);/)
    assert.doesNotMatch(css, /color: (primary|warn);/)

    // node_modules css is plain global css
    assert.match(css, /\.lib-class\s*\{/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
