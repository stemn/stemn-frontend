/** Version bumps and changelog entries for scripts/release/prepare.mjs (pure, unit-tested) */
const versionPattern = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/

export const parseVersion = (version) => {
  const match = versionPattern.exec(version)
  if (!match) throw new Error(`Unsupported version "${version}": use X.Y.Z or X.Y.Z-beta.N`)
  const [, major, minor, patch, beta] = match
  return { major: +major, minor: +minor, patch: +patch, beta: beta === undefined ? null : +beta }
}

/**
 * Next version for `kind`:
 *   major | minor | patch   1.2.3 -> 2.0.0 | 1.3.0 | 1.2.4 (from a beta: 1.3.0-beta.2 + patch -> 1.3.0)
 *   beta                    1.2.3 -> 1.2.4-beta.1, 1.2.4-beta.1 -> 1.2.4-beta.2
 *   X.Y.Z[-beta.N]          that version (must be greater than the current one)
 */
export const bumpVersion = (current, kind) => {
  const v = parseVersion(current)
  switch (kind) {
    case 'major':
      return `${v.major + 1}.0.0`
    case 'minor':
      return v.beta !== null && v.patch === 0 ? `${v.major}.${v.minor}.0` : `${v.major}.${v.minor + 1}.0`
    case 'patch':
      return v.beta !== null ? `${v.major}.${v.minor}.${v.patch}` : `${v.major}.${v.minor}.${v.patch + 1}`
    case 'beta':
      return v.beta !== null
        ? `${v.major}.${v.minor}.${v.patch}-beta.${v.beta + 1}`
        : `${v.major}.${v.minor}.${v.patch + 1}-beta.1`
    default: {
      parseVersion(kind)
      if (compare(kind, current) <= 0) throw new Error(`${kind} is not greater than the current version ${current}`)
      return kind
    }
  }
}

const compare = (a, b) => {
  const x = parseVersion(a)
  const y = parseVersion(b)
  for (const key of ['major', 'minor', 'patch']) if (x[key] !== y[key]) return x[key] - y[key]
  if (x.beta === y.beta) return 0
  if (x.beta === null) return 1
  if (y.beta === null) return -1
  return x.beta - y.beta
}

/**
 * Changelog lines from `git log --format=%s%x1f%b%x1e`: merge commits become "- <PR title> (#N)",
 * squash merges "- <title> (#N)", other commits "- <subject>". Branch merges and release commits are skipped.
 */
export const notesFromGitLog = (log) => {
  const lines = []
  for (const record of String(log || '').split('\x1e')) {
    const [subject = '', body = ''] = record.trim().split('\x1f')
    if (!subject.trim()) continue
    const merge = /^Merge pull request #(\d+) from \S+/.exec(subject)
    if (merge) {
      const title = body.trim().split('\n')[0].trim()
      lines.push(`- ${title || subject.trim()} (#${merge[1]})`)
      continue
    }
    if (/^Merge (branch|remote-tracking branch)/.test(subject)) continue
    if (/^chore\(desktop\): release /.test(subject)) continue
    lines.push(`- ${subject.trim()}`)
  }
  return [...new Set(lines)].join('\n')
}
