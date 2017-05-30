import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import BetaModal from './BetaModal'

export default (modalName) => {
  registerModal(modalName, BetaModal)
  return modalName
}
