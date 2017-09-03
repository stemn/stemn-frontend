import { connect } from 'react-redux'
import EditorToolbar from './EditorToolbar'
import uploadModalName from 'stemn-shared/misc/Upload/UploadModal'
import previewTextModalName from 'stemn-shared/misc/Editor/PreviewTextModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  showUploadModal: modalProps => showModal({
    modalType: uploadModalName,
    modalProps,
  }),
  showPreviewModal: modalProps => showModal({
    modalType: previewTextModalName,
    modalProps,
  }),
}

export default connect(stateToProps, dispatchToProps)(EditorToolbar)
