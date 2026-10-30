/**
 * electron-builder configuration: electron-builder.yml (static) + the environment overlay
 * (scripts/release/lib/builder-overlay.mjs: update feed per edition/channel, Windows signing,
 * release notes from CHANGELOG.md). The packaging scripts pass `--config electron-builder.config.mjs`.
 * Without any signing variables the result is an unsigned build, so local packaging keeps working.
 */
import { readFileSync } from 'node:fs'
import { load as loadYaml } from 'js-yaml'
import { builderOverlay, mergeConfig } from './scripts/release/lib/builder-overlay.mjs'

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8')

const base = loadYaml(read('./electron-builder.yml'))
const { version } = JSON.parse(read('./package.json'))
const { config, summary } = builderOverlay(process.env, { version, changelog: read('./CHANGELOG.md') })

if (!process.env.STEMN_BUILDER_QUIET) {
  console.log(
    `  • stemn release  ${Object.entries(summary)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ')}`,
  )
}

export default mergeConfig(base, config)
