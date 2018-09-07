import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { FileCreateModalComponent } from './FileCreateModal'

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  push,
}

export const modalName = 'FILE_CREATE'

const ModalComponent = compose(
  reduxForm({
    form: 'fileCreate',
    initialValues: {
      fileType: 'pipeline',
    },
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(FileCreateModalComponent)

registerModal(modalName, ModalComponent)
