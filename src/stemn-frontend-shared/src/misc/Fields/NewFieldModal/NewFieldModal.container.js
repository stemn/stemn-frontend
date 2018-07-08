
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import NewFieldModal from './NewFieldModal'
import { createField } from 'stemn-shared/misc/Fields/Fields.actions'

const stateToProps = ({ fields }) => ({
  newFieldForm: fields.newFieldForm,
  newFieldFormModel: 'fields.newFieldForm',
  newFieldFormPending: fields.newFieldFormPending,
})

const dispatchToProps = {
  createField,
}

const modalName = 'FIELD_NEW'

const ModalComponent = connect(stateToProps, dispatchToProps)(NewFieldModal)
registerModal(modalName, ModalComponent)

export default modalName
