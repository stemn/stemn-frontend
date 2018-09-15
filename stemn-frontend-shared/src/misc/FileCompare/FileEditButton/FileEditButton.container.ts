import { connect } from 'react-redux'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { editToggle } from '../FileCompare.actions'
import { FileEditButtonComponent } from './FileEditButton'

export interface IFileEditButtonContainerProps {
  file1: IFile,
  cacheKey: string,
  editActive: boolean,
}

const stateToProps = ({ files: { previewMarkdown } }) => ({
  previewMarkdown,
})

export const dispatchToProps = {
  editToggle,
}

export const FileEditButton = connect(stateToProps, dispatchToProps)(FileEditButtonComponent)
