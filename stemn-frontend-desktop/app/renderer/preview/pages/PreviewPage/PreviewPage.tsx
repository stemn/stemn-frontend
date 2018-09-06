import * as cn from 'classnames'
import { get } from 'lodash'
import * as moment from 'moment'
import * as React from 'react'
import { push as pushRouteType } from 'react-router-redux'
import DragResize from 'stemn-shared/misc/DragResize/DragResize'
import { isSelected, orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner'
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import FileBreadCrumbs from 'stemn-shared/misc/FileList/components/FileBreadCrumbs'
import AssemblyParts from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts'
import { formatBytes } from 'stemn-shared/misc/Files/utils'
import Header from 'stemn-shared/misc/Header/Header.jsx'
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable'
import Timeline from 'stemn-shared/misc/Timeline/Timeline'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle'
import * as classes from './PreviewPage.scss'

export interface IPreviewPageProps {
  pushRoute: typeof pushRouteType,
  showWindow: (name: string) => void,
  select: any,
  cacheKey: string,
  compare: any,
  changeMode: any,
  file: any,
  timeline: any,
}

export class PreviewPage extends React.Component<IPreviewPageProps> {
  public clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId, project: { _id: projectId } } = file
    const { pushRoute, showWindow } = this.props
    if (file.type === 'file') {
      // It is a file - open the file
      pushRoute({
        pathname: '/',
        query: {
          fileId,
          revisionId,
          projectId,
        },
      })
    } else if (projectId) {
      // It is a folder (and is linked to a project) - open the folder
      pushRoute({
        pathname: `/project/${projectId}/files/${fileId}`,
        state: { meta: { scope: ['main'] } },
      })
      showWindow('main')
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
    const {
      compare: { mode, selected1, selected2 },
      file,
      timeline,
    } = this.props
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])
    const timelineData = get(timeline, 'data', [])
    const revisions = getRevisions(timelineData)
    const displayFileHeader = ['sideBySide', 'aboveAndBelow'].includes(mode)

    return (
      <div
        className='layout-column flex'
        style={{ overflow: 'hidden', maxHeight: '100vh' }}
      >
        <Header>
          { file.data && (
            <FileBreadCrumbs
              className='text-ellipsis no-drag'
              meta={file.data}
              clickFn={this.clickFileOrFolder}
              popup={true}
            />
          )}
          <div className='flex' />
          { file.data && (
            <FileCompareMenu
              file1={file1}
              file2={file2}
              revisions={revisions}
              mode={mode}
              changeMode={this.changeMode}
            />
          )}
          <div className='divider' />
        </Header>
        <div className='layout-row flex rel-box'>
          <div className={cn(classes.preview, 'layout-column flex')}>
            { file.data && [
                <FileCompareInner
                  key='preview'
                  className='layout-column flex'
                  project={file.data.project}
                  file1={file1}
                  file2={file2}
                  mode={mode}
                  header={displayFileHeader}
                />,
                <Timeline
                  key='timeline'
                  className={classes.timeline}
                  items={timelineData}
                  onSelect={this.onSelect}
                  isSelected={this.isSelected}
                  preferPlace='above'
                />,
            ]}
          </div>
          <DragResize
            side='left'
            width='450'
            widthRange={[0, 450]}
            className='layout-column'
          >
            <aside className={classes.sidebar}>
              { file.data && (
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
          </DragResize>
        </div>
      </div>
    )
  }
}
