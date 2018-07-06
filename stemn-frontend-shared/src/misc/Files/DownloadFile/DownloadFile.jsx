import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { saveFile } from '../Files.actions.js'
import React, { Component } from 'react'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { getDownloadUrl } from '../utils'

class DownloadFile extends Component {
  saveFile = () => {
    const { file, fileUrl, saveFile } = this.props
    const anchorEl = ReactDOM.findDOMNode(this.anchorRef)
    // If we dont have a href attribute, we run the saveFile function
    // If we do, the click action will have already started downloading via the html5 download api
    // This second method will only work on desktop
    if (!anchorEl.getAttribute('href')) {
      saveFile({
        file,
        fileUrl,
        anchorEl, // This is only used on web - not desktop
      })
    }
  }
  anchorRef = null
  getAnchorRef = (ref) => {
    if (ref) {
      this.anchorRef = ref
    }
  }
  render() {
    const {
      children,
      title,
      progress,
    } = this.props
    return (
      <a
        ref={ this.getAnchorRef }
        className="link-primary"
        onClick={ this.saveFile }
        title={ title }
      >
        { children }
        <LoadingOverlay
          show={ progress && progress > 0 && progress < 100 }
          linear
          hideBg
        />
      </a>
    )
  }
}

function mapStateToProps({ files }, { file }) {
  const fileUrl = getDownloadUrl(file)
  return {
    fileUrl,
    progress: files.downloadProgress[fileUrl],
  }
}

const dispatchToProps = {
  saveFile,
}

export default connect(mapStateToProps, dispatchToProps)(DownloadFile)
