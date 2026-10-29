/** Unit tests for the build-time platform switch / CommonJS shim conversion (npm test) */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { transformAsync } from '@babel/core'
import stemnPlatformPlugin from '../babel-plugin-stemn-platform.mts'

const transform = async (code: string, env: Record<string, string>) => {
  const result = await transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: '/virtual/file.js',
    sourceType: 'module',
    plugins: [[stemnPlatformPlugin, { env }]],
  })
  return result!.code!
}

const desktopRenderer = { APP_TYPE: 'desktop', APP_THREAD: 'renderer' }
const desktopMain = { APP_TYPE: 'desktop', APP_THREAD: 'electron' }

test('module.exports platform switch becomes ESM re-exports', async () => {
  const code = await transform(
    "module.exports = GLOBAL_ENV.APP_TYPE === 'web'\n  ? require('./index.web.js')\n  : require('./index.desktop.js')\n",
    desktopRenderer,
  )
  assert.doesNotMatch(code, /require\(|module\.exports|index\.web/)
  assert.match(code, /import \* as \w+ from ['"]\.\/index\.desktop\.js['"]/)
  assert.match(code, /export \* from ['"]\.\/index\.desktop\.js['"]/)
  assert.match(code, /export default \w+;/)
})

test('`.default` requires become default re-exports', async () => {
  const code = await transform(
    "module.exports = GLOBAL_ENV.APP_TYPE === 'web'\n  ? require('./Link.container.web.js').default\n  : require('./Link.container.desktop.js').default\n",
    desktopRenderer,
  )
  assert.match(code, /import \* as (\w+) from ['"]\.\/Link\.container\.desktop\.js['"];[\s\S]*export default \1\.default;/)
  assert.doesNotMatch(code, /export \*/)
})

test('APP_THREAD switches keep React containers out of the main process', async () => {
  const source = "const modalName = 'ERROR'\nexport default GLOBAL_ENV.APP_THREAD === 'electron'\n  ? modalName\n  : require('./ErrorModal.container').default(modalName)\n"
  const main = await transform(source, desktopMain)
  assert.doesNotMatch(main, /ErrorModal\.container/)
  assert.match(main, /export default modalName;/)

  const renderer = await transform(source, desktopRenderer)
  assert.match(renderer, /import \* as (\w+) from ['"]\.\/ErrorModal\.container['"];[\s\S]*export default \1\.default\(modalName\);/)
})

test('unknown GLOBAL_ENV keys and other conditions are left alone', async () => {
  const code = await transform("export const x = GLOBAL_ENV.API_SERVER === 'a' ? 1 : 2\nexport const y = foo === 'web' ? 1 : 2\n", desktopRenderer)
  assert.match(code, /GLOBAL_ENV\.API_SERVER === 'a' \? 1 : 2/)
  assert.match(code, /foo === 'web' \? 1 : 2/)
})

test('a require inside a function is a build error', async () => {
  await assert.rejects(
    transform("export const f = () => require('./lazy').default\n", desktopRenderer),
    /require\(\) inside a function/,
  )
})
