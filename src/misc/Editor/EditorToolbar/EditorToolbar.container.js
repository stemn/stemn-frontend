import { connect } from 'react-redux'
import EditorToolbar from './EditorToolbar'
import uploadModalName from 'stemn-shared/misc/Upload/UploadModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  showUploadModal: modalProps => showModal({
    modalType: uploadModalName,
    modalProps,
  }),
}

export default connect(stateToProps, dispatchToProps)(EditorToolbar)
