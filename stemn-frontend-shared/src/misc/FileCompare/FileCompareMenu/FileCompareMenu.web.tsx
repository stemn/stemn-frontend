import * as cn from 'classnames'
import * as React from 'react'
import MdCode from 'react-icons/md/code'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import MdOpenInNew from 'react-icons/md/open-in-new'
import MdVisibility from 'react-icons/md/visibility'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { IFileCompareMenu } from 'stemn-shared/misc/FileCompare/FileCompareMenu/types'
import downloadModalName from 'stemn-shared/misc/Files/Download/DownloadModal'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils.js'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import { getCompareIcon, getCompareModes } from '../FileCompare.utils.js'
import { dispatchToProps } from './FileCompareMenu.container.web'

export interface IFileCompareMenuComponentProps extends IFileCompareMenu {
  togglePreviewMarkdown: typeof dispatchToProps['togglePreviewMarkdown'],
  showModal: typeof dispatchToProps['showModal'],
  previewMarkdown: boolean,
}

export class FileCompareMenuComponent extends React.Component<IFileCompareMenuComponentProps> {
  public renderMenu () {
    const { file1, revisions, showModal } = this.props
    const downloadFile = {
      label: 'Download File',
      onClick: () => showModal({
        modalType: downloadModalName,
        modalProps: {
          revisions,
          file: file1,
        },
        scope: 'local',
      }),
    }
    return [downloadFile]
  }
  public render () {
    const { enablePreview, mode, changeMode, revisions, file1, file2, previewMarkdown, togglePreviewMarkdown } = this.props

    if (!file1) { return null }

    const previewType = getViewerType(file1.name, file1.provider)
    const compareModes = getCompareModes(previewType, previewType)
    const CompareIcon = getCompareIcon(mode)
    const hasRevisions = revisions && revisions.length > 1 || file1 && file2
    const isMarkdown = file1.extension === 'md'

    return (
      <div className='layout-row layout-align-start-center'>
        { isMarkdown && (
          <SimpleIconButton onClick={togglePreviewMarkdown} title={previewMarkdown ? 'Preview Mode' : 'Code Mode'}>
            {!previewMarkdown ? <MdCode size={26} /> : <MdVisibility size={24} />}
          </SimpleIconButton>
        )}
        { hasRevisions &&
          <Popover preferPlace='below' offset={9}>
            <SimpleIconButton title='Compare'>
              <CompareIcon size={20} />
            </SimpleIconButton>
            <div className='PopoverMenu'>
              { compareModes.map((item) => (
                <a
                  key={item.value}
                  className={cn({ active: mode === item.value })}
                  onClick={() => changeMode(item.value, revisions)}
                >
                  Compare: {item.text}
                </a>
              ))}
            </div>
          </Popover> }
        { enablePreview &&
          <SimpleIconButton
            title='Open File'
            name='fileRoute'
            params={ {
              projectId: file1.project._id,
              fileId: file1.fileId,
              revisionId: file1.revisionId,
            } }
          >
            <MdOpenInNew size={23} />
          </SimpleIconButton> }
        <Popover preferPlace='below' offset={9}>
          <SimpleIconButton title='Options' style={{ marginRight: '15px' }}>
            <MdMoreHoriz size='20px' />
          </SimpleIconButton>
          <PopoverMenuList menu={this.renderMenu()} />
        </Popover>
      </div>
    )
  }
}
