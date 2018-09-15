import { connect } from 'react-redux'
import { IStoreState } from 'stemn-frontend-website/src/client/assets/javascripts/app/reducer'
import { togglePreviewMarkdown } from 'stemn-shared/misc/Files/Files.actions'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import { FileCompareMenuComponent } from './FileCompareMenu.web'

const stateToProps = ({ files: { previewMarkdown } }: IStoreState) => ({
  previewMarkdown,
})

export const dispatchToProps = {
  togglePreviewMarkdown,
  showModal,
}

export const FileCompareMenu = connect(stateToProps, dispatchToProps)(FileCompareMenuComponent)
