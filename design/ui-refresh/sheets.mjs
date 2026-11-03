/**
 * Contact sheets for the PR description: one screen across every direction, in one image.
 *
 *   node design/ui-refresh/sheets.mjs     (after capture.mjs)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import { directions, pages } from './catalog.mjs'

const here = import.meta.dirname
const SHEETS = ['P03', 'P01', 'P05', 'P08']
const out = join(here, 'gallery/sheets')
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1560, height: 900 }, deviceScaleFactor: 1.5 })
for (const id of SHEETS) {
  const cells = directions
    .map(
      (direction) => `<figure>
        <figcaption><b>${direction.letter}</b> ${direction.name}</figcaption>
        <div><img src="${pathToFileURL(join(here, 'gallery/shots', direction.id, `${id}.webp`))}"></div>
      </figure>`,
    )
    .join('')
  const name = pages.find((screen) => screen.id === id).name
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 20px; background: #f4f4f5; font: 15px Inter, system-ui, sans-serif; color: #18181b; width: 1520px; }
    h1 { font-size: 18px; margin: 0 0 14px; font-weight: 600; }
    main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    figure { margin: 0; background: #fff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; }
    figcaption { padding: 7px 10px; font-size: 13px; }
    figcaption b { font-weight: 600; margin-right: 4px; }
    figure div { height: 340px; overflow: hidden; border-top: 1px solid #e4e4e7; }
    img { width: 100%; display: block; }
  </style><h1>${id} ${name}</h1><main>${cells}</main>`
  const file = join(out, `${id}.html`)
  writeFileSync(file, html)
  await page.goto(pathToFileURL(file).href)
  await page.waitForLoadState('networkidle')
  await page
    .locator('main')
    .evaluate((main) => Promise.all([...main.querySelectorAll('img')].map((image) => image.decode())))
  await page.screenshot({ path: join(out, `${id}.jpg`), type: 'jpeg', quality: 86, fullPage: true })
}
await browser.close()
for (const id of SHEETS) console.log(join(out, `${id}.jpg`))
