import * as cn from 'classnames'
import * as React from 'react'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import MdOpenInNew from 'react-icons/md/open-in-new'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { IFileCompareMenu } from 'stemn-shared/misc/FileCompare/FileCompareMenu/types'
import downloadModalName from 'stemn-shared/misc/Files/Download/DownloadModal'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import { getCompareIcon, getCompareModes } from '../FileCompare.utils.js'
import { dispatchToProps } from './FileCompareMenu.container.desktop'

export interface IFileCompareMenuComponentProps extends IFileCompareMenu {
  togglePreviewMarkdown: typeof dispatchToProps['togglePreviewMarkdown'],
  showModal: typeof dispatchToProps['showModal'],
  openFile: typeof dispatchToProps['openFile'],
  openExternal: typeof dispatchToProps['openExternal'],
  create: typeof dispatchToProps['create'],
}

export class FileCompareMenuComponent extends React.Component<IFileCompareMenuComponentProps> {
  public menu = () => {
    const { file1, revisions, isChange } = this.props
    const openFile = {
      label: 'Open File',
      onClick: () => {
        this.props.openFile({
          path: file1.path,
          projectId: file1.project._id,
          provider: file1.provider,
        })
      },
    }
    const openFolder = {
      label: 'Open Containing Folder',
      onClick: () => {
        this.props.openFile({
          location: true,
          path: file1.path,
          projectId: file1.project._id,
          provider: file1.provider,
        })
      },
    }
    const downloadFile = {
      label: 'Download File',
      onClick: () => {
        this.props.showModal({
          modalType: downloadModalName,
          modalProps: {
            revisions,
            file: file1,
          },
          scope: 'local',
        })
      },
    }
    const viewOnline = {
      label: 'View File Online',
      onClick: () => this.props.openExternal({
        url: `${GLOBAL_ENV.WEBSITE_URL}/files/${file1.project._id}/${file1.fileId}`,
        params: {
          revision: file1.revisionId,
        },
      }),
    }
    return isChange ? [openFile, openFolder] : [openFile, openFolder, downloadFile, viewOnline]
  }

  public preview = () => {
    const { file1, create } = this.props
    create({
      type: 'PREVIEW',
      props: {
        fileId: file1.fileId,
        revisionId: file1.revisionId,
        projectId: file1.project._id,
      },
    })
  }

  public render () {
    const {
      enablePreview,
      mode,
      changeMode,
      revisions,
      file1,
      file2,
    } = this.props

    if (!file1) { return null }

    const previewType = getViewerType(file1.name, file1.provider)
    const compareModes = getCompareModes(previewType, previewType)
    const CompareIcon = getCompareIcon(mode)

    return (
      <div>
        {
          revisions && revisions.length > 1 || file1 && file2 ?
            <Popover preferPlace='below'>
              <SimpleIconButton title='Compare'>
                <CompareIcon size='20px' />
              </SimpleIconButton>
              <div className='PopoverMenu'>
                {compareModes.map((item) => <a
                  key={item.value}
                  className={cn({ active: mode === item.value })}
                  onClick={() => changeMode(item.value, revisions)}
                >
                Compare: {item.text}
                </a>)}
              </div>
            </Popover>
            : null
        }
        {
          enablePreview ?
            <SimpleIconButton title='Open popout preview' onClick={this.preview}>
              <MdOpenInNew size='20px' />
            </SimpleIconButton>
            : null
        }
        <Popover preferPlace='below'>
          <SimpleIconButton title='Options'>
            <MdMoreHoriz size='20px' />
          </SimpleIconButton>
          <PopoverMenuList menu={this.menu()} />
        </Popover>
      </div>
    )
  }
}
