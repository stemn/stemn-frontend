import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ConfirmModal from './ConfirmModal'

export default (modalName) => {
  registerModal(modalName, ConfirmModal)
  return modalName
}
