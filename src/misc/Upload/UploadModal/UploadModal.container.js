import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { reset } from '../Upload.actions'
import UploadModal from './UploadModal'

const stateToProps = () => ({
})

const dispatchToProps = {
  reset,
}

const modalName = 'UPLOAD'

const ModalComponent = connect(stateToProps, dispatchToProps)(UploadModal)
registerModal(modalName, ModalComponent)

export default modalName
