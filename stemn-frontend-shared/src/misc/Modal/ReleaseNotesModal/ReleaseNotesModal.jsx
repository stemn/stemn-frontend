import React from 'react'
import { version as installedVersion } from 'package-json'
import changelog from 'stemn-frontend-desktop/CHANGELOG.md?raw'
import { releaseNotesFor } from 'stemn-frontend-desktop/config/changelog.mjs'
import { getBridge } from 'stemn-shared/desktop/bridge'
import Banner from 'stemn-shared/misc/Banner/Banner.jsx'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'

/**
 * Release notes (desktop).
 *  - without props: the notes of the installed version, bundled from CHANGELOG.md at build time
 *  - { version, releaseNotes, downloaded: true }: a downloaded update (notes from the update feed)
 *    with "Restart to update" / "Later"
 * No network request: the EU edition never talks to GitHub.
 */
export default class ReleaseNotesModal extends React.Component {
  state = {
    installing: false,
    refused: null,
  }

  restart = async () => {
    this.setState({ installing: true, refused: null })
    const result = await getBridge().updates.quitAndInstall()
    if (!result || !result.ok) {
      this.setState({ installing: false, refused: (result && result.message) || 'The update could not be installed.' })
    }
  }

  render() {
    const { modalConfirm, modalCancel, version, releaseNotes, downloaded } = this.props
    const { installing, refused } = this.state
    const shownVersion = version || installedVersion
    const notes =
      typeof releaseNotes === 'string' && releaseNotes ? releaseNotes : releaseNotesFor(changelog, shownVersion)
    const allReleasesUrl = GLOBAL_ENV.STEMN_EDITION === 'eu' ? null : 'https://github.com/stemn/stemn-desktop/releases'

    return (
      <div style={{ width: '600px' }} data-testid="release-notes-modal">
        <div className="modal-title">
          {downloaded ? `Stemn ${shownVersion} is ready to install` : `Version ${shownVersion}`}
        </div>
        <div className="modal-body rel-box" style={{ minHeight: '200px' }}>
          {refused ? (
            <Banner type="warn" style={{ marginBottom: '15px' }}>
              {refused}
            </Banner>
          ) : null}
          <EditorDisplay value={notes || 'There are no release notes for this version.'} />
        </div>
        <div className="modal-footer-no-line layout-row layout-align-start-center">
          {allReleasesUrl ? (
            <a href={allReleasesUrl} className="link-primary">
              View all release notes
            </a>
          ) : null}
          <div className="flex" />
          {downloaded ? (
            <React.Fragment>
              <Button style={{ marginRight: '10px' }} onClick={() => modalCancel()}>
                Later
              </Button>
              <Button className="primary" disabled={installing} onClick={this.restart}>
                Restart to update
              </Button>
            </React.Fragment>
          ) : (
            <Button className="primary" onClick={() => modalConfirm()}>
              Close
            </Button>
          )}
        </div>
      </div>
    )
  }
}
