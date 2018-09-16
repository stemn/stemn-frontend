import * as cn from 'classnames'
import * as React from 'react'
import MdEdit from 'react-icons/md/edit'
import MdSave from 'react-icons/md/save'
import { getViewerType, IPreviewType } from '../../Files/PreviewFile/PreviewFile.utils'
import { dispatchToProps, IFileEditButtonContainerProps } from './FileEditButton.container'
import * as s from './FileEditButton.scss'

export interface IFileEditButtonComponentProps extends IFileEditButtonContainerProps {
  editToggle: typeof dispatchToProps['editToggle']
}

const editabledPreviewTypes: IPreviewType[] = ['pipeline', 'code']

export class FileEditButtonComponent extends React.Component<IFileEditButtonComponentProps> {
  public render () {
    const { file1, editToggle, cacheKey, editActive } = this.props
    const isEditabled = editabledPreviewTypes.includes(getViewerType(file1.extension, file1.provider))

    if (isEditabled) {
      return (
        <a
          onClick={() => editToggle({ cacheKey })}
          className={cn(s.editButton, 'layout-column', 'layout-align-center-center')}
          title={editActive ? 'Save File' : 'Edit File'}
        >
          {editActive ? <MdSave size={20} /> : <MdEdit size={20} />}
        </a>
      )
    }
    return null
  }
}
