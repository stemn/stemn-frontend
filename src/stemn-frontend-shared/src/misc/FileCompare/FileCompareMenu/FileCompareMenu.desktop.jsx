/** ************************************************************************
We pass in either revisions or file1 + file2.
************************************************************************* */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import * as SystemActions from 'stemn-shared/desktop/System/System.actions.js'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import React from 'react'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils.js'
import cn from 'classnames'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { getCompareModes, getCompareIcon } from '../FileCompare.utils.js'
import downloadModalName from 'stemn-shared/misc/Files/Download/DownloadModal'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import MdOpenInNew from 'react-icons/md/open-in-new'

export class Component extends React.Component {
  menu = () => {
    const { file1, revisions, dispatch, isChange } = this.props
    const discardChanges = {
      label: 'Discard Changes',
      onClick: () => {
      },
    }
    const openFile = {
      label: 'Open File',
      onClick: () => {
        dispatch(SystemActions.openFile({
          path: file1.path,
          projectId: file1.project._id,
          provider: file1.provider,
        }))
      },
    }
    const openFolder = {
      label: 'Open Containing Folder',
      onClick: () => {
        dispatch(SystemActions.openFile({
          location: true,
          path: file1.path,
          projectId: file1.project._id,
          provider: file1.provider,
        }))
      },
    }
    const downloadFile = {
      label: 'Download File',
      onClick: () => {
        dispatch(ModalActions.showModal({
          modalType: downloadModalName,
          modalProps: {
            revisions,
            file: file1,
          },
          scope: 'local',
        }))
      },
    }
    const viewOnline = {
      label: 'View File Online',
      onClick: () => dispatch(SystemActions.openExternal({
        url: `${GLOBAL_ENV.WEBSITE_URL}/files/${file1.project._id}/${file1.fileId}`,
        params: {
          revision: file1.revisionId,
        },
      })),
    }
    return isChange ? [discardChanges, openFile, openFolder] : [openFile, openFolder, downloadFile, viewOnline]
  };

  preview = () => {
    const { file1, dispatch } = this.props
    dispatch(ElectronWindowsActions.create({
      type: 'PREVIEW',
      props: {
        fileId: file1.fileId,
        revisionId: file1.revisionId,
        projectId: file1.project._id,
      },
    }))
  };

  render() {
    const {
      enablePreview,
      mode,
      changeMode,
      revisions,
      file1,
      file2,
    } = this.props

    if (!file1) { return null }

    const previewType  = getViewerType(file1.name, file1.provider)
    const compareModes = getCompareModes(previewType, previewType)
    const CompareIcon  = getCompareIcon(mode)

    return (
      <div>
        {
          revisions && revisions.length > 1 || file1 && file2 ?
            <Popover preferPlace="below">
              <SimpleIconButton title="Compare">
                <CompareIcon size="20px" />
              </SimpleIconButton>
              <div className="PopoverMenu">
                {compareModes.map(item => <a
                  key={ item.value }
                  className={ cn({ active: mode === item.value }) }
                  onClick={ () => changeMode(item.value, revisions) }
                >
                Compare: {item.text}
                </a>)}
              </div>
            </Popover>
            : null
        }
        {
          enablePreview ?
            <SimpleIconButton title="Open popout preview" onClick={ this.preview }>
              <MdOpenInNew size="20px" />
            </SimpleIconButton>
            : null
        }
        <Popover preferPlace="below">
          <SimpleIconButton title="Options">
            <MdMoreHoriz size="20px" />
          </SimpleIconButton>
          <PopoverMenuList menu={ this.menu() } />
        </Popover>
      </div>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    electronWindowsActions: bindActionCreators(ElectronWindowsActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

