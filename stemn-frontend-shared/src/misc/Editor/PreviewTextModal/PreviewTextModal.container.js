import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import PreviewTextModal from './PreviewTextModal'

export default (modalName) => {
  registerModal(modalName, PreviewTextModal)
  return modalName
}
