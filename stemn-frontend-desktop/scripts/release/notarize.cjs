/**
 * electron-builder afterSign hook: notarises the signed macOS app with Apple's notary service
 * (@electron/notarize, notarytool) using an App Store Connect API key, then staples the ticket.
 *
 * A no-op (with a log line) on other platforms, for unsigned builds and without credentials, so
 * local and CI packaging work without any Apple account.
 *
 *   APPLE_API_KEY      path to the AuthKey_<id>.p8 file (CI writes the APPLE_API_KEY_P8 secret to a file)
 *   APPLE_API_KEY_ID   key id
 *   APPLE_API_ISSUER   issuer id (UUID)
 */
const { existsSync } = require('node:fs')
const { join } = require('node:path')

const log = (message) => console.log(`  • notarize       ${message}`)

module.exports = async function notarizeHook(context) {
  const { electronPlatformName, appOutDir, packager } = context
  if (electronPlatformName !== 'darwin') return
  // Universal builds pack x64 and arm64 into temporary apps first; only the merged app is notarised
  if (/-temp$/.test(appOutDir)) return

  const { APPLE_API_KEY, APPLE_API_KEY_ID, APPLE_API_ISSUER } = process.env
  if (!APPLE_API_KEY || !APPLE_API_KEY_ID || !APPLE_API_ISSUER) {
    log('skipped: APPLE_API_KEY, APPLE_API_KEY_ID and APPLE_API_ISSUER are not set')
    return
  }
  if (!process.env.CSC_LINK && !process.env.CSC_NAME) {
    log('skipped: the app is not signed with a Developer ID certificate (CSC_LINK)')
    return
  }
  if (!existsSync(APPLE_API_KEY)) {
    throw new Error(`APPLE_API_KEY must be the path of the .p8 key file: ${APPLE_API_KEY} does not exist`)
  }

  const appPath = join(appOutDir, `${packager.appInfo.productFilename}.app`)
  log(`submitting ${appPath} (this takes a few minutes)`)
  const { notarize } = await import('@electron/notarize')
  await notarize({
    appPath,
    appleApiKey: APPLE_API_KEY,
    appleApiKeyId: APPLE_API_KEY_ID,
    appleApiIssuer: APPLE_API_ISSUER,
  })
  log(`notarised and stapled ${appPath}`)
}
