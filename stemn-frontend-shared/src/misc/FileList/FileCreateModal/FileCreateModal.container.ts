import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { FileCreateModalComponent } from './FileCreateModal'

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  push,
}

export const modalName = 'FILE_CREATE'
const ModalComponent = connect(mapStateToProps, mapDispatchToProps)(FileCreateModalComponent)
registerModal(modalName, ModalComponent)
