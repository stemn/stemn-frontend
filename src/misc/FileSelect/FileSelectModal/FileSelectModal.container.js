import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import FileSelectModal from './FileSelectModal'

import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { init, changePath, select } from '../FileSelect.actions.js'


const stateToProps = ({ fileSelect }, { storeKey }) => ({
  fileSelect: fileSelect[storeKey],
})

const dispatchToProps = {
  storeChange,
  init,
  changePath,
  select,
}

const modalName = 'FILE_SELECT'
const ModalComponent = connect(stateToProps, dispatchToProps)(FileSelectModal)
registerModal(modalName, ModalComponent)
export default modalName
