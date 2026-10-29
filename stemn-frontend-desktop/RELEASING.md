# Releasing Stemn Desktop

How a desktop release is cut, signed, published, rolled back, and how the auto-updater finds it.
Design: [docs/plans/desktop-auto-update-and-signing.md](../docs/plans/desktop-auto-update-and-signing.md).

```
prepare.mjs ─► PR ─► tag desktop-vX.Y.Z ─► desktop-release.yml
                                            ├─ test     unit tests + updater integration test (AppImage, local feed)
                                            ├─ build    ubuntu / windows / macos  x  edition (global, eu)
                                            │           sign + notarise when the secrets exist, verify the yml
                                            └─ publish  DRAFT release vX.Y.Z in stemn/stemn-desktop
                                                        + installers staged on the feed bucket(s)
founder publishes the draft ─► forwarder in stemn/stemn-desktop ─► desktop-release.yml (promote)
                                                                    the feed(s) now serve X.Y.Z
installed apps poll the feed ─► download ─► "Restart to update" (or install on quit)
```

## Editions, channels and feeds

| Edition | Built with | Update feed (what installed apps poll) |
| --- | --- | --- |
| global | `STEMN_EDITION=global` (default) | GitHub releases of [stemn/stemn-desktop](https://github.com/stemn/stemn-desktop) until `UPDATES_URL_GLOBAL` is set; then the generic feed `$UPDATES_URL_GLOBAL/<channel>/` (e.g. `https://updates.stemn.com/desktop/stable/`) |
| eu | `STEMN_EDITION=eu` | generic feed `${UPDATES_URL_EU:-https://updates.stemn.eu/desktop}/<channel>/` on EU object storage. Never calls GitHub (the in-app release notes are bundled from `CHANGELOG.md` or come from the feed). |

The feed is decided at build time ([config/updateFeed.cjs](config/updateFeed.cjs)) and baked into both the
main process (`GLOBAL_ENV.UPDATE_FEED`) and `app-update.yml` (electron-builder `publish`). EU artefacts are
named `Stemn-EU-<version>-...`.

**Channels**: `stable` and `beta`. The version decides the channel of a build (`1.3.0-beta.2` is beta,
`1.3.0` stable); users pick the channel they follow in Preferences > Update channel (default: the channel
of the installed version). Stable updates download in the background and install on the next quit or with
"Restart to update"; beta updates are offered and downloaded on request. Apps never downgrade: switching
from beta to stable waits for the next stable version.

**Generic feed layout** (one directory per channel, under each bucket root):

```
<root>/stable/latest.yml, latest-mac.yml, latest-linux.yml   live channel files (switched by promote / rollback)
<root>/stable/Stemn-1.2.0-win-x64.exe (+ .blockmap), ...     installers, uploaded with the draft
<root>/stable/releases/1.2.0/latest*.yml                     archived channel files of every release
<root>/beta/beta.yml, beta-mac.yml, beta-linux.yml           same for beta; stable releases are copied here
<root>/beta/releases/<version>/beta*.yml                     too, so beta users get a newer stable release
```

Differential updates: NSIS and the macOS zip ship `.blockmap` files and the AppImage has an embedded block
map, so electron-updater downloads only the changed blocks.

## Cutting a release

1. On an up-to-date `staging` checkout:

   ```sh
   node stemn-frontend-desktop/scripts/release/prepare.mjs minor        # or patch | major | beta | 1.2.0 | 1.3.0-beta.1
   ```

   It bumps `stemn-frontend-desktop/package.json` (and its `package-lock.json` entry) and adds a
   `CHANGELOG.md` entry from the titles of the pull requests merged since the last `desktop-v*` tag.
   `--dry-run` shows the result without writing.
2. Edit the `CHANGELOG.md` entry: it becomes the feed's `releaseNotes`, the in-app release notes and the
   GitHub release body. Commit (`chore(desktop): release 1.2.0`) and merge through a pull request.
3. Tag the merged commit and push the tag:

   ```sh
   git tag desktop-v1.2.0 && git push origin desktop-v1.2.0
   ```

   The tag must match the package version (the `plan` job checks it).
4. `desktop-release.yml` tests, builds, signs and creates the **draft** release `v1.2.0` in
   stemn/stemn-desktop (a pre-release for beta versions) with every installer, the channel files and
   `SHA256SUMS` (+ `SHA256SUMS.asc` when GPG is configured), and stages the installers on the feed bucket(s).
   Check the run summary for "NOT signed" notices.
5. Review the draft (download an installer, read the notes) and **publish** it. GitHub-provider apps see it
   immediately; the forwarder (below) triggers `promote`, which switches the generic feed(s) and verifies the
   public feed URL. Without the forwarder, run it by hand: Actions > desktop release > Run workflow >
   `promote`, version `1.2.0`.

A dry run (Actions > desktop release > Run workflow > `dry-run`, or any pull request that touches the release
files) builds every platform unsigned and verifies the feed files without publishing anything.

### Forwarder in stemn/stemn-desktop

A release published in stemn/stemn-desktop cannot trigger a workflow in this repository directly. Add this
workflow to stemn/stemn-desktop (`.github/workflows/notify-stemn-frontend.yml`) with a
`STEMN_FRONTEND_DISPATCH_TOKEN` secret (fine-grained token, stemn/stemn-frontend, Contents: read and write):

```yaml
name: notify stemn-frontend
on:
  release:
    types: [published]
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - run: >
          gh api repos/stemn/stemn-frontend/dispatches -f event_type=desktop-release-published
          -f 'client_payload[version]=${{ github.event.release.tag_name }}'
        env:
          GH_TOKEN: ${{ secrets.STEMN_FRONTEND_DISPATCH_TOKEN }}
```

`repository_dispatch` runs the workflow of the default branch (`staging`).

## Secrets and variables

Everything is optional: a missing secret skips its step with a notice, so the pipeline is green unsigned.

| Name | Kind | Used by | What it is |
| --- | --- | --- | --- |
| `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | secret | build (windows) | Entra ID app registration with the "Trusted Signing Certificate Profile Signer" role |
| `AZURE_TRUSTED_SIGNING_ENDPOINT` | secret | build (windows) | e.g. `https://weu.codesigning.azure.net` (West Europe) |
| `AZURE_TRUSTED_SIGNING_ACCOUNT_NAME` | secret | build (windows) | Trusted Signing account name |
| `AZURE_TRUSTED_SIGNING_CERTIFICATE_PROFILE` | secret | build (windows) | certificate profile name |
| `AZURE_TRUSTED_SIGNING_PUBLISHER_NAME` | secret | build (windows) | the certificate subject CN (e.g. `STEMN Pty Ltd`); also written to `app-update.yml` so electron-updater checks the publisher of downloaded updates |
| `CSC_LINK` | secret | build (macos) | Developer ID Application certificate + key, `.p12` as base64 |
| `CSC_KEY_PASSWORD` | secret | build (macos) | password of that `.p12` |
| `APPLE_API_KEY_P8` | secret | build (macos) | App Store Connect API key (`AuthKey_XXXX.p8` contents), role Developer, for notarytool |
| `APPLE_API_KEY_ID`, `APPLE_API_ISSUER` | secret | build (macos) | key id and issuer id of that key |
| `GPG_PRIVATE_KEY`, `GPG_PASSPHRASE` | secret | publish | armored release-signing key: signs `SHA256SUMS` (Linux artefact integrity) |
| `DESKTOP_RELEASES_TOKEN` | secret | publish, rollback | fine-grained token on **stemn/stemn-desktop** only, Contents: read and write (creates the draft release, uploads assets, `--github` rollback) |
| `UPDATES_RCLONE_CONFIG` | secret | publish, promote, rollback | an `rclone.conf` with the remotes of the buckets (S3-compatible credentials) |
| `UPDATES_BUCKET_GLOBAL`, `UPDATES_BUCKET_EU` | variable | publish, promote, rollback, plan | rclone paths of the feed roots, e.g. `stemn-eu:updates-stemn-eu/desktop`. Setting the EU one also adds the EU edition to the build matrix |
| `UPDATES_URL_GLOBAL` | variable | build, promote | public base url of the global generic feed (`https://updates.stemn.com/desktop`); unset = GitHub provider |
| `UPDATES_URL_EU` | variable | build, promote | public base url of the EU feed (default `https://updates.stemn.eu/desktop`) |
| `DESKTOP_BUILD_EU` | variable | plan | `true` builds the EU edition before its bucket is configured |
| `DESKTOP_SENTRY_DSN` | variable | build | optional Sentry DSN baked into the renderers |

## Signing

### Windows: Azure Trusted Signing (assumed) or SSL.com eSigner

The pipeline signs with **Azure Trusted Signing** through electron-builder's `win.azureSignOptions` (added by
[scripts/release/lib/builder-overlay.mjs](scripts/release/lib/builder-overlay.mjs) only when all seven
`AZURE_*` values are set; a partial configuration fails the build). No hardware token, keys stay in Azure,
EU regions available, billed per month plus signatures (Basic tier, about US$10/month for 5,000 signatures
at the time of writing). Public-trust certificates need Microsoft's identity validation of STEMN Pty Ltd
(eligibility rules on business history and country apply; check them before choosing). The account owner is
whoever holds the Azure subscription (the founder); the cost is that subscription's.

Alternative: an OV/EV certificate from **SSL.com with eSigner** (cloud HSM, CodeSignTool). To switch, replace
`windowsSigning()` in the overlay with a `win.signtoolOptions.sign` hook that calls CodeSignTool (secrets
`ES_USERNAME`, `ES_PASSWORD`, `ES_CREDENTIAL_ID`, `ES_TOTP_SECRET`); nothing else changes. A `.pfx` in
`WIN_CSC_LINK`/`WIN_CSC_KEY_PASSWORD` also works (electron-builder signs with it natively).

Check: `signtool verify /pa /v` runs on the installer and `win-unpacked/Stemn.exe` when the secrets exist.

### macOS: Developer ID + hardened runtime + notarisation

Universal (arm64 + x64) dmg and zip, hardened runtime with [build/entitlements.mac.plist](build/entitlements.mac.plist).
electron-builder signs with `CSC_LINK`; the `afterSign` hook [scripts/release/notarize.cjs](scripts/release/notarize.cjs)
notarises the app with `@electron/notarize` (notarytool, App Store Connect API key, never an Apple ID password)
and staples it. Without credentials the hook logs "skipped" and the build stays unsigned. Note: Squirrel.Mac
only installs signed updates, so unsigned macOS builds cannot auto-update.

Checks (when the secrets exist): `codesign --verify --deep --strict`, `codesign -dv`, `spctl --assess`,
`xcrun stapler validate`.

### Linux

AppImage (auto-updates) and `.deb` (updated by installing the new package; the in-app updater is off for
it). Integrity: the SHA-512 in `latest-linux.yml` (checked by electron-updater) and a GPG-signed
`SHA256SUMS.asc` on the GitHub release. The AppImage is not signed in-band with `appimagetool --sign`:
that would mean re-assembling the AppImage outside electron-builder and recomputing its feed hash and block
map, for a signature electron-updater does not check.

## Rolling back

When a published version is bad:

```sh
# from Actions: desktop release > Run workflow > rollback, version 1.2.0 (optional: to, github)
# or locally (rclone configured, GH_TOKEN with access to stemn/stemn-desktop):
UPDATES_BUCKET_EU=stemn-eu:updates-stemn-eu/desktop \
  node stemn-frontend-desktop/scripts/release/rollback.mjs 1.2.0 [--to 1.1.0] [--github] [--dry-run]
```

The live channel files are replaced with the archived ones of the previous version (or `--to`), so no new
installs of 1.2.0 happen; the beta channel is rolled back too if it served 1.2.0. `--github` turns the
GitHub release back into a draft for GitHub-provider apps. Apps never downgrade automatically: users already
on 1.2.0 stay there until a newer version ships, so the fix is a new patch release (`prepare.mjs patch`)
whose notes link the previous installer if a reinstall is needed.

## Hosting the feed on EU object storage

Any S3-compatible bucket in an EU region (e.g. Scaleway Object Storage fr-par, OVHcloud, Hetzner, AWS
eu-central-1) behind HTTPS on `updates.stemn.eu` (the bucket's website endpoint behind Caddy, or a CDN):

- the feed is static files; no CORS needed (the main process fetches it, not a page)
- `latest*.yml`/`beta*.yml` are uploaded with `Cache-Control: no-cache, max-age=0`; installers can be cached
- HTTP range requests must be allowed (differential downloads)
- public read on the feed root; the CI credentials (in `UPDATES_RCLONE_CONFIG`) need write access

```ini
# UPDATES_RCLONE_CONFIG example (Scaleway, Paris)
[stemn-eu]
type = s3
provider = Scaleway
access_key_id = ...
secret_access_key = ...
region = fr-par
endpoint = s3.fr-par.scw.cloud
acl = public-read
```

Then set `UPDATES_BUCKET_EU=stemn-eu:updates-stemn-eu/desktop` (and `UPDATES_URL_EU` if the public URL differs
from `https://updates.stemn.eu/desktop`). The same applies to the global feed (`UPDATES_BUCKET_GLOBAL`,
`UPDATES_URL_GLOBAL`); setting `UPDATES_URL_GLOBAL` moves new global builds from GitHub to the generic feed
(already installed GitHub-provider builds keep polling GitHub, so keep publishing GitHub releases).

Check a feed at any time: `node stemn-frontend-desktop/scripts/release/verify-feed.mjs https://updates.stemn.eu/desktop/stable --require win,mac,linux`.

The only adoption signal is the feed server's access log (no telemetry in the app); mention it in the
privacy notice if the site links to the downloads.

## Testing the updater

- Unit: `npx vitest run stemn-frontend-desktop/tests/unit` (feed files, channel selection, the commit guard,
  the electron-builder overlay, rollback/promote with a fake rclone).
- Integration: `npm run desktop:test:updater` (Linux, X display; CI uses xvfb and `libfuse2t64`). Packages an
  unsigned AppImage, "installs" it under `qa/`, serves a local generic feed advertising 99.0.0, and checks
  update-available -> update-downloaded, the release-notes prompt, the title bar button and tray banner, that
  "Restart to update" is refused while a commit is in flight, and that it then installs and relaunches the
  new version. Screenshots: `qa/updater-*.png`. `UPDATER_SKIP_PACKAGE=1` reuses the AppImage.
- By hand: package (`npm run package`), serve a feed directory (`<dir>/stable/latest-linux.yml` + installer)
  with any static server and run the AppImage with `STEMN_UPDATES_URL=http://127.0.0.1:<port>`
  (`STEMN_UPDATER_DELAY_MS=0` checks immediately). `STEMN_UPDATES_URL` works with packaged builds only
  (unpackaged dev builds never update).

Updater logs are structured lines in `<userData>/logs/main.log`:
`[updater] {"event":"update-downloaded","version":"1.2.0",...}` (events: configured, started, checking,
update-available, update-not-available, download-started, update-downloaded, install, install-refused,
channel-changed, error, ...).
