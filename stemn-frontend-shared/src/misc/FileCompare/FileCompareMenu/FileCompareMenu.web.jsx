/** ************************************************************************
We pass in either revisions or file1 + file2.
************************************************************************* */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils.js'
import cn from 'classnames'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { getCompareModes, getCompareIcon } from '../FileCompare.utils.js'
import Popover from 'stemn-shared/misc/Popover'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import MdOpenInNew from 'react-icons/md/open-in-new'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import downloadModalName from 'stemn-shared/misc/Files/Download/DownloadModal'
import { togglePreviewMarkdown } from 'stemn-shared/misc/UserSettings/UserSettings.actions'
import MdVisibility from 'react-icons/md/visibility'
import MdCode from 'react-icons/md/code'

export class FileCompareMenu extends Component {
  renderMenu() {
    const { file1, revisions, showModal } = this.props
    const downloadFile = {
      label: 'Download File',
      onClick: () => {
        showModal({
          modalType: downloadModalName,
          modalProps: {
            revisions,
            file: file1,
          },
          scope: 'local',
        })
      },
    }
    return [downloadFile]
  }
  render() {
    const { enablePreview, mode, changeMode, revisions, file1, file2, previewMarkdown, togglePreviewMarkdown } = this.props

    if (!file1) { return null }

    const previewType = getViewerType(file1.name, file1.provider)
    const compareModes = getCompareModes(previewType, previewType)
    const CompareIcon = getCompareIcon(mode)
    const hasRevisions = revisions && revisions.length > 1 || file1 && file2
    const isMarkdown = file1.extension === 'md'

    return (
      <div className="layout-row layout-align-start-center">
        { isMarkdown && (
          <SimpleIconButton onClick={ togglePreviewMarkdown } title={ previewMarkdown ? 'Preview Mode' : 'Code Mode' }>
            { !previewMarkdown ? <MdCode size={ 26 } /> : <MdVisibility size={ 24 } /> }
          </SimpleIconButton>
        )} 
        { hasRevisions &&
          <Popover preferPlace="below" offset={ 9 }>
            <SimpleIconButton title="Compare">
              <CompareIcon size={ 20 } />
            </SimpleIconButton>
            <div className="PopoverMenu">
              { compareModes.map(item => (
                <a
                  key={ item.value }
                  className={ cn({ active: mode === item.value }) }
                  onClick={ () => changeMode(item.value, revisions) }
                >
                  Compare: { item.text }
                </a>
              ))}
            </div>
          </Popover> }
        { enablePreview &&
          <SimpleIconButton
            title="Open File"
            name="fileRoute"
            params={ {
              projectId: file1.project._id,
              fileId: file1.fileId,
              revisionId: file1.revisionId,
            } }
          >
            <MdOpenInNew size={ 23 } />
          </SimpleIconButton> }
        <Popover preferPlace="below" offset={ 9 }>
          <SimpleIconButton title="Options">
            <MdMoreHoriz size="20px" />
          </SimpleIconButton>
          <PopoverMenuList menu={ this.renderMenu() } />
        </Popover>
      </div>
    )
  }
}


const stateToProps = ({ userSettings: { previewMarkdown } }) => ({
  previewMarkdown,
})

const dispatchToProps = {
  togglePreviewMarkdown,
  showModal,
}

export default connect(stateToProps, dispatchToProps)(FileCompareMenu)

