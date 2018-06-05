import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import ProviderAccessRevokedModal from './ProviderAccessRevokedModal'

export default (modalName) => {
  registerModal(modalName, ProviderAccessRevokedModal)
  return modalName
}
