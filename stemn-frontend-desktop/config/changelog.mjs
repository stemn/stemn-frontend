/**
 * CHANGELOG.md helpers, shared by the release scripts (scripts/release/prepare.mjs), the
 * electron-builder config (the feed's `releaseNotes` for the version being built) and the
 * renderer's release notes dialog (notes of the installed version, bundled at build time, so the
 * app never has to ask GitHub for them).
 *
 * Format: one `## <version>` heading per release, newest first, optionally followed by a date:
 *
 *   ## 1.2.0 (2026-11-02)
 *
 *   - Restart to update from the tray (#41)
 */
export const CHANGELOG_TITLE = '# Stemn Desktop changelog'

const headingPattern = /^##\s+\[?v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\]?(?:\s.*)?$/

/** [{ version, heading, body }] in file order */
export const parseChangelog = (changelog = '') => {
  const releases = []
  let current = null
  for (const line of String(changelog).split(/\r?\n/)) {
    const match = headingPattern.exec(line)
    if (match) {
      current = { version: match[1], heading: line, lines: [] }
      releases.push(current)
    } else if (/^#{1,2}\s/.test(line)) {
      current = null
    } else if (current) {
      current.lines.push(line)
    }
  }
  return releases.map(({ version, heading, lines }) => ({ version, heading, body: lines.join('\n').trim() }))
}

/** Markdown notes of one version ('' if the changelog has no entry for it) */
export const releaseNotesFor = (changelog, version) => {
  const release = parseChangelog(changelog).find((entry) => entry.version === version)
  return release ? release.body : ''
}

/** Insert (or replace) the entry of `version` at the top of the changelog */
export const prependRelease = (changelog, { version, date, notes }) => {
  const heading = `## ${version}${date ? ` (${date})` : ''}`
  const entry = `${heading}\n\n${String(notes || '').trim()}\n`
  const text = String(changelog || '').trim() ? String(changelog) : `${CHANGELOG_TITLE}\n`
  const lines = text.split(/\r?\n/)
  // drop an existing entry of the same version
  const kept = []
  let skipping = false
  for (const line of lines) {
    const match = headingPattern.exec(line)
    if (match) skipping = match[1] === version
    else if (/^#{1,2}\s/.test(line)) skipping = false
    if (!skipping) kept.push(line)
  }
  const firstRelease = kept.findIndex((line) => headingPattern.test(line))
  const head = (firstRelease === -1 ? kept : kept.slice(0, firstRelease)).join('\n').trimEnd()
  const rest = firstRelease === -1 ? '' : kept.slice(firstRelease).join('\n').trim()
  return `${head}\n\n${entry}${rest ? `\n${rest}\n` : ''}`
}
