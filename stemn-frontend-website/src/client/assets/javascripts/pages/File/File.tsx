import * as cn from 'classnames'
import { get } from 'lodash'
import * as moment from 'moment'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import MdClose from 'react-icons/md/close'
import MdMenu from 'react-icons/md/menu'
import { fileRoute, projectRoute } from 'route-actions'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import { isSelected, orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner'
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import FileBreadCrumbs from 'stemn-shared/misc/FileList/components/FileBreadCrumbs'
import AssemblyParts from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts'
import { formatBytes } from 'stemn-shared/misc/Files/utils'
import { PipelineGraphSidebar } from 'stemn-shared/misc/Pipelines/PipelineGraph'
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable'
import Timeline from 'stemn-shared/misc/Timeline/Timeline'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle'
import { dispatchToProps } from './File.container'
import * as classes from './File.scss'

export interface IFileComponentState {
  isOpen: boolean,
}

export interface IFileComponentProps {
  changeMode: typeof dispatchToProps['changeMode'],
  fetchTimeline: typeof dispatchToProps['fetchTimeline'],
  getMeta: typeof dispatchToProps['getMeta'],
  initCompare: typeof dispatchToProps['initCompare'],
  pushRoute: typeof dispatchToProps['pushRoute'],
  select: typeof dispatchToProps['select'],
  cacheKey: string,
  compare: any,
  file?: {
    data?: any,
  },
  timeline: any,
}

export class FileComponent extends React.Component<IFileComponentProps, IFileComponentState> {
  public state = {
    isOpen: false,
  }
  public toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
  public clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId } = file
    const { pushRoute } = this.props
    const projectId = this.props.file && this.props.file.data.project._id
    if (file.type === 'file') {
      pushRoute(fileRoute({ fileId, projectId, revisionId }))
    } else if (projectId) {
      pushRoute(projectRoute({ projectId }))
    }
  }
  public onSelect = (file) => {
    const { select, cacheKey, compare: { mode, lastSelected } } = this.props
    select({ file, mode, lastSelected, cacheKey })
  }
  public changeMode = (mode) => {
    const { changeMode, cacheKey } = this.props
    changeMode({ cacheKey, mode })
  }
  public isSelected = (item) => {
    const { compare: { selected1, selected2, mode } } = this.props
    return isSelected({ item, selected1, selected2, mode })
  }
  public render () {
    const { compare: { mode, selected1, selected2, editActive }, file, timeline, cacheKey } = this.props
    const { isOpen } = this.state
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])
    const timelineData = get(timeline, 'data', [])
    const revisions = getRevisions(timelineData)
    const displayFileHeader = ['sideBySide', 'aboveAndBelow'].includes(mode)

    return (
      <div className='layout-column flex' style={{ overflow: 'hidden', maxHeight: '100vh' }}>
        { file && file.data && (
          <Helmet>
            <title>{`${file.data.project.name} - ${file.data.path}`}</title>
          </Helmet>
        )}
        <div className={classes.header}>
          { file && file.data && (
            <FileBreadCrumbs
              className='text-ellipsis'
              meta={file.data}
              link={true}
              popup={true}
            />
          )}
          <div className='flex' />
          { file && file.data && (
            <FileCompareMenu
              cacheKey={cacheKey}
              file1={file1}
              file2={file2}
              revisions={revisions}
              mode={mode}
              editActive={editActive}
              changeMode={this.changeMode}
            />
          )}
          <SimpleIconButton
            className={classes.sidebarButton}
            onClick={this.toggleOpen}
            title={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </SimpleIconButton>
        </div>
        <div className='layout-row flex rel-box'>
          <div className={cn(classes.preview, 'layout-column flex')}>
            {file && file.data && (
              <FileCompareInner
                className='layout-column flex'
                project={file.data.project}
                file1={file1}
                file2={file2}
                mode={mode}
                header={displayFileHeader}
                editActive={editActive}
              />
            )}
            {file && file.data && (
              <Timeline
                className={classes.timeline}
                items={timelineData}
                onSelect={this.onSelect}
                isSelected={this.isSelected}
                preferPlace='above'
              />
              )}
          </div>
          <aside className={cn(classes.sidebar, { [classes.isOpen]: isOpen })}>
            {editActive && <PipelineGraphSidebar diagramId={cacheKey} />}
            {!editActive && file && file.data && (
              <div>
                <SectionTitle className={classes.sidebarTitle}>Meta</SectionTitle>
                <SimpleTable>
                  <tr><td>Name</td><td>{file.data.name}</td></tr>
                  <tr><td>Size</td><td>{formatBytes(file.data.size)}</td></tr>
                  <tr><td>Last modified</td><td>{moment(file.data.modified).fromNow()}</td></tr>
                  { revisions.length > 0 &&
                  <tr><td>Revisions</td><td>{revisions.length}</td></tr> }
                </SimpleTable>
                <AssemblyParts
                  fileMeta={file}
                  clickFn={this.clickFileOrFolder}
                />
                <SectionTitle className={classes.sidebarTitle}>Timeline</SectionTitle>
                <TimelineVertical
                  items={timelineData}
                  type='file'
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    )
  }
}
