import { connect } from 'react-redux'
import { push } from 'stemn-shared/routing'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { uploadFile } from '../../Files/actions/uploadFile'
import { FileCreateModalComponent } from './FileCreateModal'

const stateToProps = () => ({})

export const dispatchToProps = {
  push,
  uploadFile,
}

export const modalName = 'FILE_CREATE'

const ModalComponent = connect(stateToProps, dispatchToProps)(FileCreateModalComponent)

registerModal(modalName, ModalComponent)
