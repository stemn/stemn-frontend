// import { get } from 'lodash'
// import Button from 'stemn-shared/misc/Buttons/Button/Button'
// import Input from 'stemn-shared/misc/Input/Input/Input'
// import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
// import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'
// import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
// import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
// import { ArrowTab, ArrowTabs } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx'
import cn from 'classnames'
import { useForm } from 'react-hook-form'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { FormDropdown, FormField, FormInput, FormUpload } from 'stemn-shared/misc/Input'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import sLogin from 'stemn-shared/pages/Login/Login.module.scss'
import { IFolder } from '../types'
import { dispatchToProps } from './FileCreateModal.container'

const FormLoadingOverlay = ({ input: { value } }) => <LoadingOverlay show={value}>Uploading files...</LoadingOverlay>

const fileTypes = ['pipeline', 'txt', 'md']

const options = fileTypes.map((item) => ({
  name: `.${item}`,
  value: item,
}))

export interface IFileCreateModalComponentProps {
  folder: IFolder
  uploadFile: (typeof dispatchToProps)['uploadFile']
  push: (typeof dispatchToProps)['push']
}

interface IFormData {
  fileName: string
  fileType: string
  uploads: File[]
  loading: boolean
}

const initialValues: Partial<IFormData> = {
  fileType: 'pipeline',
}

export const FileCreateModalComponent = ({ folder, uploadFile }: IFileCreateModalComponentProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<IFormData>({
    // Validate on every change and blur; fields show errors once meta.touched (blurred or submitted)
    mode: 'all',
    defaultValues: initialValues,
  })

  const submit = (data: IFormData) =>
    uploadFile({
      projectId: folder.project._id,
      parent: folder._id,
      name: `${data.fileName}.${data.fileType}`,
      file: 'some data',
    })

  const onDrop = (files: File[]) => {
    setValue('loading', true)
  }

  return (
    <form onSubmit={handleSubmit(submit)} style={{ width: '600px', padding: '30px', position: 'relative' }}>
      <FormField control={control} name="loading" component={FormLoadingOverlay} />
      <div className={cn('text-mini-caps')} style={{ marginBottom: '10px' }}>
        Upload files
      </div>
      <FormUpload input={{ onChange: onDrop }} />
      <div className={sLogin.textDivider}>
        <div>OR</div>
      </div>
      <div className={cn('text-mini-caps')} style={{ marginBottom: '10px' }}>
        Create a new file
      </div>
      <div className="layout-row">
        <FormField
          control={control}
          name="fileName"
          component={FormInput}
          className="dr-input flex"
          type="text"
          placeholder="File Name"
        />
        <FormField
          control={control}
          name="fileType"
          component={FormDropdown}
          options={options}
          style={{ width: '90px', borderLeft: 'none' }}
        />
      </div>
      <div className="layout-row layout-align-end" style={{ marginTop: '30px' }}>
        <ProgressButton className="primary" type="submit" loading={isSubmitting}>
          Create File
        </ProgressButton>
      </div>
    </form>
  )
}
