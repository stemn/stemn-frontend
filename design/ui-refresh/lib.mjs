import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** `.Button_button` -> any element with a CSS-module class of that prefix (`Button_button-Ab3x_`) */
const MODULE_CLASS = /\.([A-Za-z][\w-]*?_[A-Za-z][A-Za-z0-9]*)(?![\w-])/g
export const moduleSelector = (selector) =>
  selector.replace(MODULE_CLASS, (_, name) => `:is([class^="${name}-"], [class*=" ${name}-"])`)

/**
 * Builds a direction's stylesheet. Directions are valid CSS that reads as if the app's CSS modules had plain
 * class names. Everything after the `@rules` marker is nested under `html[data-direction]`, so it outranks
 * the original rules of the same shape without an !important on every line.
 */
export const buildDirectionCss = (dir, id) => {
  if (id === 'current') return ''
  const read = (file) => readFileSync(join(dir, 'directions', file), 'utf8')
  const parts = [read(`${id}.css`), read('_base.css')]
  const [themeHead, themeRules = ''] = parts[0].split('/* @rules */')
  const [baseHead, baseRules = ''] = parts[1].split('/* @rules */')
  const rules = moduleSelector(`${baseRules}\n${themeRules}`)
  return `${themeHead}\n${baseHead}\nhtml[data-direction] {\n${rules}\n}`
}
