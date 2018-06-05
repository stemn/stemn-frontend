import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ReleaseNotesModal from './ReleaseNotesModal'

export default (modalName) => {
  registerModal(modalName, ReleaseNotesModal)
  return modalName
}
