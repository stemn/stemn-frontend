import { connect } from 'react-redux'
import { IStoreState } from 'reducer'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { getFile, renderFile } from '../../Files/Files.actions'
import { isAssembly } from './PreviewCad/PreviewCad.utils'
import { PreviewFileComponent } from './PreviewFile'

export interface IPreviewFileContainerProps {
  file: IFile
  header?: boolean,
  event: any,
  editActive?: boolean,
}

const stateToProps = ({ files }: IStoreState, { file, event }: IPreviewFileContainerProps) => {
  // If the file has sub-parts, it is a gerber assembly - we need to fetch multiple files
  if (file.parts) {
    const fileData = file.parts.map((part) => files.fileData[`${part.fileId}-${part.revisionId}`])
    return {
      fileData,
    }
  } else {
    const cacheKey = event && event.timestamp && isAssembly(file.extension)
      ? `${file.fileId}-${file.revisionId}-${event.timestamp}`
      : `${file.fileId}-${file.revisionId}`

    const fileData = files.fileData[cacheKey]
    const fileRender = files.fileRenders[cacheKey]
    return {
      fileData,
      fileRender,
    }
  }
}

export const dispatchToProps = {
  getFile,
  renderFile,
}

export const PreviewFile = connect(stateToProps, dispatchToProps)(PreviewFileComponent)
