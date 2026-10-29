/**
 * The environment-dependent part of the electron-builder configuration (pure: unit-tested in
 * tests/unit/release.test.ts, applied by electron-builder.config.mjs).
 *
 *   STEMN_EDITION, UPDATES_URL   update feed of the edition (config/updateFeed.cjs)
 *   UPDATES_CHANNEL              'stable' | 'beta' (default: from the version, 1.2.0-beta.1 -> beta)
 *   AZURE_TRUSTED_SIGNING_*      Windows: Azure Trusted Signing (with AZURE_TENANT_ID / AZURE_CLIENT_ID /
 *     + AZURE_TENANT_ID, ...     AZURE_CLIENT_SECRET for the Entra ID app registration)
 *   CSC_LINK, CSC_KEY_PASSWORD   macOS: Developer ID Application certificate (read by electron-builder itself)
 *   APPLE_API_KEY, ...           macOS notarisation (scripts/release/notarize.cjs)
 */
import { createRequire } from 'node:module'
import { releaseNotesFor } from '../../../config/changelog.mjs'

const require = createRequire(import.meta.url)
const {
  CHANNELS,
  builderPublishConfig,
  channelForVersion,
  resolveUpdateFeed,
} = require('../../../config/updateFeed.cjs')

export const AZURE_SIGNING_ENV = [
  'AZURE_TRUSTED_SIGNING_ENDPOINT',
  'AZURE_TRUSTED_SIGNING_ACCOUNT_NAME',
  'AZURE_TRUSTED_SIGNING_CERTIFICATE_PROFILE',
  'AZURE_TRUSTED_SIGNING_PUBLISHER_NAME',
  'AZURE_TENANT_ID',
  'AZURE_CLIENT_ID',
  'AZURE_CLIENT_SECRET',
]

export const APPLE_NOTARIZE_ENV = ['APPLE_API_KEY', 'APPLE_API_KEY_ID', 'APPLE_API_ISSUER']

const hasAll = (env, names) => names.every((name) => !!env[name])

/** Windows code signing, isolated so the provider can be swapped (see RELEASING.md "Windows signing") */
export const windowsSigning = (env) => {
  if (hasAll(env, AZURE_SIGNING_ENV)) {
    return {
      provider: 'azure-trusted-signing',
      win: {
        azureSignOptions: {
          endpoint: env.AZURE_TRUSTED_SIGNING_ENDPOINT,
          codeSigningAccountName: env.AZURE_TRUSTED_SIGNING_ACCOUNT_NAME,
          certificateProfileName: env.AZURE_TRUSTED_SIGNING_CERTIFICATE_PROFILE,
          publisherName: env.AZURE_TRUSTED_SIGNING_PUBLISHER_NAME,
        },
      },
    }
  }
  const partial = AZURE_SIGNING_ENV.filter((name) => env[name])
  if (partial.length > 0) {
    throw new Error(
      `Azure Trusted Signing is partly configured (${partial.join(', ')}); also set ${AZURE_SIGNING_ENV.filter((name) => !env[name]).join(', ')}`,
    )
  }
  // A .pfx in WIN_CSC_LINK / CSC_LINK is picked up by electron-builder itself
  if (env.WIN_CSC_LINK) return { provider: 'certificate', win: {} }
  return { provider: 'none', win: {} }
}

/**
 * @param {Record<string, string | undefined>} env
 * @param {{ version: string, changelog?: string }} app
 */
export const builderOverlay = (env, { version, changelog = '' }) => {
  const channel = env.UPDATES_CHANNEL || channelForVersion(version)
  if (!CHANNELS.includes(channel)) {
    throw new Error(`Unknown UPDATES_CHANNEL "${channel}". Use one of ${CHANNELS.join(', ')}.`)
  }
  if (channel === 'stable' && channelForVersion(version) !== 'stable') {
    throw new Error(`${version} is a pre-release version: it can only be published to the beta channel`)
  }
  const feed = resolveUpdateFeed(env)
  const windows = windowsSigning(env)
  const releaseNotes = releaseNotesFor(changelog, version)

  const config = {
    publish: builderPublishConfig(feed, channel),
    win: windows.win,
  }
  if (releaseNotes) config.releaseInfo = { releaseNotes }
  if (feed.edition !== 'global') {
    config.artifactName = `\${productName}-${feed.edition.toUpperCase()}-\${version}-\${os}-\${arch}.\${ext}`
  }

  return {
    config,
    summary: {
      version,
      channel,
      edition: feed.edition,
      feed: feed.provider === 'generic' ? config.publish[0].url : `github:${feed.owner}/${feed.repo}`,
      windowsSigning: windows.provider,
      macSigning: env.CSC_LINK || env.CSC_NAME ? 'developer-id' : 'none (unless a keychain identity is found)',
      notarize: hasAll(env, APPLE_NOTARIZE_ENV) ? 'app-store-connect-api-key' : 'skipped',
      releaseNotes: releaseNotes ? 'CHANGELOG.md' : 'none',
    },
  }
}

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

/** Deep merge for configs: objects are merged, arrays and other values replaced */
export const mergeConfig = (base, overlay) => {
  const result = { ...base }
  for (const [key, value] of Object.entries(overlay)) {
    result[key] = isPlainObject(value) && isPlainObject(base[key]) ? mergeConfig(base[key], value) : value
  }
  return result
}
