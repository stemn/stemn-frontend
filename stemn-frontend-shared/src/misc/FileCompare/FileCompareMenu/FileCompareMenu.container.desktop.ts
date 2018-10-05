import { connect } from 'react-redux'
import { IStoreState } from 'reducer'
import { create } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions'
import { openExternal, openFile } from 'stemn-shared/desktop/System/System.actions'
import { togglePreviewMarkdown } from 'stemn-shared/misc/Files/Files.actions'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import { FileCompareMenuComponent } from './FileCompareMenu.desktop'

const stateToProps = ({ files: { previewMarkdown } }: IStoreState) => ({
  previewMarkdown,
})

export const dispatchToProps = {
  togglePreviewMarkdown,
  showModal,
  openFile,
  openExternal,
  create,
}

export const FileCompareMenu = connect(stateToProps, dispatchToProps)(FileCompareMenuComponent)
