
import { connect } from 'react-redux'
import FieldSearch from './FieldSearch'
import newFieldModalName from 'stemn-shared/misc/Fields/NewFieldModal'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  showNewFieldModal: modalProps => showModal({
    modalType: newFieldModalName,
    modalProps,
  }),
}

export default connect(stateToProps, dispatchToProps)(FieldSearch)
