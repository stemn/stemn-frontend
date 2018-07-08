import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ErrorModal from './ErrorModal'

export default (modalName) => {
  registerModal(modalName, ErrorModal)
  return modalName
}
