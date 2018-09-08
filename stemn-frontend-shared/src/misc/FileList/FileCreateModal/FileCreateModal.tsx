// import { get } from 'lodash'
// import Button from 'stemn-shared/misc/Buttons/Button/Button'
// import Input from 'stemn-shared/misc/Input/Input/Input'
// import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
// import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'
// import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
// import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
// import { ArrowTab, ArrowTabs } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx'
// import * as classes from '../ProjectNewModal/ProjectNewModal.scss'
import * as cn from 'classnames'
import * as React from 'react'
import { ImageFile } from 'react-dropzone'
import { Field, Form, InjectedFormProps } from 'redux-form'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { FormDropdown, FormInput, FormUpload } from 'stemn-shared/misc/Input'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import * as sLogin from 'stemn-shared/pages/Login/Login.scss'
import { IFolder } from '../types'
import { dispatchToProps } from './FileCreateModal.container'

const FormLoadingOverlay = ({ input: { value } }) => <LoadingOverlay show={value}>Uploading files...</LoadingOverlay>

const fileTypes = ['pipeline', 'txt', 'md']

const options = fileTypes.map((item) => ({
  name: `.${item}`,
  value: item,
}))

export interface IFileCreateModalComponentProps extends InjectedFormProps {
  folder: IFolder,
  uploadFile: typeof dispatchToProps['uploadFile']
  push: typeof dispatchToProps['push']
}

interface IFormData {
  fileName: string,
  fileType: string,
  uploads: ImageFile[]
}

export class FileCreateModalComponent extends React.Component<IFileCreateModalComponentProps> {
  public submit = (formData) => {
    const { uploadFile, folder } = this.props
    const data = formData as IFormData
    return uploadFile({
      projectId: folder.project._id,
      path: folder.path,
      file: JSON.stringify(data),
    })
  }
  public onDrop = (files: ImageFile[]) => {
    const { change } = this.props
    change('loading', true)
  }
  public render () {
    const { handleSubmit, submitting } = this.props
    return (
      <Form
        onSubmit={handleSubmit(this.submit)}
        style={{ width: '600px', padding: '30px', position: 'relative' }}
      >
        <Field name='loading' component={FormLoadingOverlay}/>
        <div className={cn('text-mini-caps')} style={{ marginBottom: '10px' }}>Upload files</div>
        <FormUpload input={{ onChange: this.onDrop }}/>
        <div className={sLogin.textDivider}><div>OR</div></div>
        <div className={cn('text-mini-caps')} style={{ marginBottom: '10px' }}>Create a new file</div>
        <div className='layout-row'>
          <Field
            name='fileName'
            component={FormInput}
            className='dr-input flex'
            type='text'
            placeholder='File Name'
          />
          <Field
            name='fileType'
            component={FormDropdown}
            options={options}
            style={{ width: '90px', borderLeft: 'none' }}
          />
        </div>
        <div className='layout-row layout-align-end' style={{ marginTop: '30px' }}>
          <ProgressButton
            className='primary'
            type='submit'
            loading={submitting}
          >
            Create File
          </ProgressButton>
        </div>
      </Form>
    )
  }
}
