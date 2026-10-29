# Plan: desktop auto-update, code signing and release pipeline

Status: approved for implementation as a reviewable pull request (founder, 2026-10-29).
Planner: Claude Fable 5.1. Implementer: an Opus 5.5 agent following this plan.

## Goal

A Stemn desktop release is produced by CI from a git tag, signed and notarised for every
platform, published to an update feed that the installed app checks, downloads and applies with
a user-visible prompt, with the ability to roll back a bad release and to run everything against
a local feed in tests. The EU edition's feed must be hostable on EU infrastructure.

## Current state (verified in the Electron 45 port)

- `electron-updater` 6 is wired in `stemn-frontend-shared/src/desktop/AutoUpdate/AutoUpdate.init.js`
  (events → Redux actions; `checkForUpdates` on start when the setting is on).
- `stemn-frontend-desktop/electron-builder.yml` has a `publish` provider (GitHub releases of
  `Stemn/Stemn-Desktop`), NSIS for Windows, dmg + zip for macOS, AppImage for Linux;
  `latest-linux.yml` is produced locally. Nothing is signed; no CI builds installers; the old
  AppVeyor/Travis/`deploy.sh` flow is dead.
- The renderer shows update state through the existing `AutoUpdate` reducer/components.

## Design decisions

0. **Releases repository**: `github.com/stemn/stemn-desktop` is the public releases repository
   (it has held the app's releases since 2018 and installed apps poll it). It carries no source and
   nothing is committed there by hand: the release workflow in this repository publishes installers
   and `latest*.yml` manifests to its Releases (cleanup PR stemn/stemn-desktop#31 removes its stale
   compiled `dist/`, AppVeyor/Travis configs and publish scripts).
1. **Feed**: electron-updater's `generic` provider pointed at an HTTPS static feed
   (`https://updates.stemn.com/desktop/<channel>/` and `https://updates.stemn.eu/desktop/<channel>/`)
   served from object storage behind Caddy or a CDN. GitHub Releases remain the artefact store and
   a mirror; the generic feed is what installed apps poll, so the EU edition never calls GitHub.
   The feed is just `latest.yml` / `latest-mac.yml` / `latest-linux.yml` plus the installers,
   which electron-builder already generates.
2. **Channels**: `stable` (default) and `beta`, selected by an app setting and encoded in
   the version pre-release tag (`1.2.0-beta.3`); electron-updater's `channel`/`allowPrerelease`
   handle it.
3. **Signing**:
   - **Windows**: Azure Trusted Signing (no hardware token in CI; per-signature cost, EU region
     available) or an OV/EV certificate via SSL.com eSigner. electron-builder supports both via
     `win.signtoolOptions`/`azureSignOptions`. Decision needed from the founder: Trusted Signing is
     the lowest-friction option in 2026; the plan assumes it, with the certificate step isolated so
     it can be swapped.
   - **macOS**: Apple Developer ID Application certificate (p12 in CI secrets) + hardened runtime +
     notarisation with `@electron/notarize` through electron-builder's `afterSign`, using an
     App Store Connect API key (not an Apple ID password). Universal (arm64 + x64) build.
   - **Linux**: AppImage and `.deb`; AppImage signed with a GPG key (`appimagetool --sign`),
     feed integrity via electron-updater's SHA-512 in `latest-linux.yml`.
4. **Differential updates**: enabled for NSIS and zip (blockmap), nothing extra required.
5. **Rollback**: a release is "pulled" by republishing the previous `latest*.yml` to the feed
   (script `scripts/release/rollback.mjs <version>`); the app does not auto-downgrade, so the
   pulled version's users are prompted to reinstall via a release note link.
6. **Update UX**: keep the existing AutoUpdate Redux flow; add a "Restart to update" affordance in
   the menubar window and the main window title bar, a settings toggle for channel, and a manual
   "Check for updates" in the tray menu; never force-restart while a commit is in progress.
7. **Telemetry**: none beyond electron-updater's feed requests; the feed server logs are the only
   adoption signal (document that in the privacy notice if the marketing site links to it).

## Work breakdown (one PR, reviewed before merge)

1. `electron-builder.yml`: `publish` → `generic` with `url` from env per edition and channel;
   `win`: NSIS, `azureSignOptions` behind env, `signAndEditExecutable: true`; `mac`: hardened
   runtime, entitlements file (file access, network client), `notarize` config, universal target;
   `linux`: AppImage + deb, `category`, desktop entry; `afterSign` hook for notarisation when
   credentials are present and a no-op otherwise, so local packaging keeps working unsigned.
2. `src/main` updater wiring: channel setting, `autoDownload` on for stable only, `autoInstallOnAppQuit`,
   expose `checkForUpdates`/`quitAndInstall` through the preload bridge (`window.stemnDesktop`),
   guard against installing during a pending commit (read the store), structured logs.
3. Renderer: tray menu item, menubar window banner, settings toggle (channel, auto-update),
   release notes dialog from the feed's `releaseNotes` (markdown rendered with the existing
   markdown pipeline).
4. CI: `.github/workflows/desktop-release.yml` on tags `desktop-v*`: matrix (ubuntu, windows,
   macos), `npm ci`, `npm run desktop:build`, `electron-builder --publish never`, sign/notarise
   with secrets (`AZURE_*`, `APPLE_API_KEY_*`, `CSC_LINK`/`CSC_KEY_PASSWORD`, `GPG_*`), upload
   artefacts, then a `publish` job that creates a draft GitHub Release **in `stemn/stemn-desktop`**
   (cross-repository token `DESKTOP_RELEASES_TOKEN`), uploads installers and
   `latest*.yml`, and syncs the feed directory to the object-storage bucket(s) with `rclone`
   (`UPDATES_BUCKET_GLOBAL`, `UPDATES_BUCKET_EU`). Draft → the founder publishes the release,
   which flips the feed to the new version (publish job runs on `release: published`).
5. Scripts: `scripts/release/{prepare,rollback,verify-feed}.mjs` (bump versions in both
   package.json files, generate changelog from PR titles, verify the feed's yml points at
   artefacts that exist and whose SHA-512 match).
6. Tests (must pass in CI without any signing secrets):
   - Unit: feed yml generation/verification, channel selection, "do not install during commit".
   - Integration: package an unsigned AppImage, serve a local generic feed with a *newer* dummy
     version from a temp HTTP server, launch the app with `UPDATES_URL` pointed at it under
     `xvfb-run`, assert the `update-available` → `update-downloaded` events and the UI prompt
     (Playwright + Electron, reusing the existing e2e harness); assert that `quitAndInstall` is
     refused while a commit is in flight.
   - Signing smoke (only when secrets exist, `if:` guarded): `signtool verify` / `codesign -dv`
     / `spctl --assess` on the produced artefacts; `xcrun stapler validate` after notarisation.
7. Docs: `stemn-frontend-desktop/RELEASING.md` (how to cut a release, required secrets, how to
   roll back, how to host the feed on EU object storage, how to test the updater locally).

## Acceptance criteria for review

- `desktop-release.yml` is green on a tag push with signing secrets absent (unsigned draft) and
  the integration test proves an installed app updates from a local feed.
- The PR body lists every secret the pipeline needs, where it is used, and the cost/ownership of
  the Windows signing option chosen.
- No change to the website or shared web code paths; the desktop e2e suite still passes.
