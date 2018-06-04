import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ThreadLabelsEditModal from './ThreadLabelsEditModal'

export default (modalName) => {
  registerModal(modalName, ThreadLabelsEditModal)
  return modalName
}
