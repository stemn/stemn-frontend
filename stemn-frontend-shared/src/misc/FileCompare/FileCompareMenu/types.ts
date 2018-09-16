import { IFile } from 'stemn-shared/misc/FileList/types'

export interface IFileCompareMenu {
  cacheKey?: string,
  mode: string,
  changeMode: (value: any, revisions: any) => void,
  revisions: any,
  file1: IFile,
  file2?: IFile,
  isChange?: boolean,
  enablePreview?: boolean,
  editActive?: boolean,
}
