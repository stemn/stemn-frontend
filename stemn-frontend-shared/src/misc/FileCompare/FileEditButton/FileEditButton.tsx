import * as cn from 'classnames'
import * as React from 'react'
import MdEdit from 'react-icons/md/edit'
import MdSave from 'react-icons/md/save'
import { dispatchToProps, IFileEditButtonContainerProps } from './FileEditButton.container'
import * as s from './FileEditButton.scss'

export interface IFileEditButtonComponentProps extends IFileEditButtonContainerProps {
  editToggle: typeof dispatchToProps['editToggle']
}

export class FileEditButtonComponent extends React.Component<IFileEditButtonComponentProps> {
  public render () {
    const { file1, editToggle, cacheKey, editActive } = this.props
    const isPipeline = file1.extension === 'pipeline'

    if (isPipeline) {
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
