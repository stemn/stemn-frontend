import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import PreviewExpiredModal from './PreviewExpiredModal'

export default (modalName) => {
  registerModal(modalName, PreviewExpiredModal)
  return modalName
}
