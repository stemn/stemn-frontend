import * as cn from 'classnames'
import { get } from 'lodash'
import * as React from 'react'
import DragResize from 'stemn-shared/misc/DragResize/DragResize'
import { IFileCompareItem } from 'stemn-shared/misc/FileCompare/FileCompare.reducer'
import { isSelected, orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils'
import { FileCompareInner } from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner'
import { FileCompareMenu } from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import Timeline from 'stemn-shared/misc/Timeline/Timeline.jsx'
import TogglePanel from 'stemn-shared/misc/TogglePanel/TogglePanel.jsx'
import { dispatchToProps, IFileCompareContainerProps } from './FileCompare.container'
import * as classes from './FileCompare.scss'

export interface IFileCompareComponentProps extends IFileCompareContainerProps {
  fetchTimeline: typeof dispatchToProps['fetchTimeline'],
  toggle: typeof dispatchToProps['toggle'],
  initCompare: typeof dispatchToProps['initCompare'],
  changeMode: typeof dispatchToProps['changeMode'],
  select: typeof dispatchToProps['select'],
  syncTimelineCacheKey: string,
  togglePanelCacheKey: string,
  className?: string,
  type?: 'collapse',
  compare: IFileCompareItem
}

export class FileCompareComponent extends React.Component<IFileCompareComponentProps> {
  public onSelect = (file) => {
    const { select, syncTimelineCacheKey, compare: { mode, lastSelected } } = this.props
    select({
      file,
      mode,
      lastSelected,
      cacheKey: syncTimelineCacheKey,
    })
  }
  public changeMode = (mode, revisions) => {
    const { changeMode, syncTimelineCacheKey } = this.props
    changeMode({
      cacheKey: syncTimelineCacheKey,
      mode,
    })
  }
  public isSelected = (item) => {
    const { compare: { selected1, selected2, mode } } = this.props
    return isSelected({
      item,
      selected1,
      selected2,
      mode,
    })
  }
  public render () {
    const { compare: { mode, selected1, selected2 }, file, togglePanelCacheKey, type, className } = this.props
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])

    const collapseTemplate = () => (
      <div className={className}>
        <TogglePanel cacheKey={togglePanelCacheKey}>
          <div className='text-ellipsis text-grey-4'>{file.data.path}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={file.revisions}
            mode={mode}
            changeMode={this.changeMode}
            enablePreview={true}
          />
          <DragResize
            side='bottom'
            height='500'
            heightRange={[0, 1000]}
            className='layout-column flex'
          >
            <FileCompareInner
              event={selected1}
              file1={file1}
              file2={file2}
              mode={mode}
            />
            { file.revisions.length > 1
              ? <Timeline
                className={classes.timeline}
                size='sm'
                onSelect={this.onSelect}
                isSelected={this.isSelected}
                items={file.revisions}
                preferPlace='above'
              />
              : null }
          </DragResize>
        </TogglePanel>
      </div>
    )

    const standardTemplate = () => (
      <div className={cn('layout-column flex', className)}>
        <div className={`${classes.header} layout-row layout-align-start-center`}>
          <div className='flex'>{file.data.path}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={file.revisions}
            mode={mode}
            changeMode={this.changeMode}
            enablePreview={true}
          />
        </div>
        <div className='layout-column flex'>
          <FileCompareInner
            event={selected1}
            file1={file1}
            file2={file2}
            mode={mode}
            header={['sideBySide', 'aboveAndBelow'].includes(mode)}
          />
        </div>
        <Timeline
          className={classes.timeline}
          size='sm'
          onSelect={this.onSelect}
          isSelected={this.isSelected}
          items={file.revisions}
          preferPlace='above'
        />
      </div>
    )

    if (!file1) {
      return null
    }
    return type === 'collapse'
      ? collapseTemplate()
      : standardTemplate()
  }
}
