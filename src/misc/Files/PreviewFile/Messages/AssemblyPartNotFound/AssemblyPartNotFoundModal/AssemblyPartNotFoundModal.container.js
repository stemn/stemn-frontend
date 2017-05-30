import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import AssemblyPartNotFoundModal from './AssemblyPartNotFoundModal'

export default (modalName) => {
  registerModal(modalName, AssemblyPartNotFoundModal)
  return modalName
}
