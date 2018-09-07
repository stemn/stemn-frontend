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
import { Field, Form, InjectedFormProps } from 'redux-form'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import { FormDropdown, FormInput } from 'stemn-shared/misc/Input'
import Upload from 'stemn-shared/misc/Upload/Upload'
import * as sLogin from 'stemn-shared/pages/Login/Login.scss'
import { IFolder } from '../types'
import * as s from './FileCreateModal.scss'

const uploadId = 'UploadModal'

const fileTypes = ['pipeline', 'txt', 'md']

const options = fileTypes.map((item) => ({
  name: `.${item}`,
  value: item,
}))

export interface IFileCreateModalComponentProps extends InjectedFormProps {
  folder: IFolder,
}

export class FileCreateModalComponent extends React.Component<IFileCreateModalComponentProps> {
  public submit = (formData) => {
    console.log(formData)
  }
  public render () {
    const { handleSubmit } = this.props
    return (
      <Form onSubmit={handleSubmit(this.submit)} style={{ width: '600px', padding: '30px' }}>
        <div className={cn('text-mini-caps')} style={{ marginBottom: '10px' }}>Upload a file</div>
        <Upload
          imageClassName={s.image}
          uploadId={uploadId}
        />
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
          >
            Create File
          </ProgressButton>
        </div>
      </Form>
    )
  }
}
