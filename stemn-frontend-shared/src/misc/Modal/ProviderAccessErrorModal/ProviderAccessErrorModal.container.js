import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ProviderAccessErrorModal from './ProviderAccessErrorModal'

export default (modalName) => {
  registerModal(modalName, ProviderAccessErrorModal)
  return modalName
}
