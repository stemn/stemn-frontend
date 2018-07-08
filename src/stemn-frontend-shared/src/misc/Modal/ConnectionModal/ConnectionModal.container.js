import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ConnectionModal from './ConnectionModal'

export default (modalName) => {
  registerModal(modalName, ConnectionModal)
  return modalName
}
