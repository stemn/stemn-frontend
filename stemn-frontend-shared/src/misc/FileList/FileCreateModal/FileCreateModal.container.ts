import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { uploadFile } from '../FileList.actions'
import { FileCreateModalComponent } from './FileCreateModal'

const stateToProps = () => ({})

export const dispatchToProps = {
  push,
  uploadFile,
}

export const modalName = 'FILE_CREATE'

const ModalComponent = compose(
  reduxForm({
    form: 'fileCreate',
    initialValues: {
      fileType: 'pipeline',
    },
  }),
  connect(stateToProps, dispatchToProps),
)(FileCreateModalComponent)

registerModal(modalName, ModalComponent)
