import React, { Component } from 'react'
import cn from 'classnames'
import classes from './File.scss'
import { projectRoute, fileRoute } from 'route-actions'
import { orderItemsByTime, isSelected } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import { get } from 'lodash'
import { formatBytes } from 'stemn-shared/misc/Files/utils'
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js'
import moment from 'moment'
import AssemblyParts from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts'
import FileBreadCrumbs from 'stemn-shared/misc/FileList/components/FileBreadCrumbs'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable'
import Timeline from 'stemn-shared/misc/Timeline/Timeline'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner'
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdMenu from 'react-icons/md/menu'
import MdClose from 'react-icons/md/close'
import { Helmet } from 'react-helmet'

export default class File extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }
  toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
  clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId } = file
    const { pushRoute } = this.props
    const projectId = this.props.file.data.project._id
    if (file.type == 'file') {
      pushRoute(fileRoute({ fileId, projectId, revisionId }))
    } else if (projectId) {
      pushRoute(projectRoute({ projectId }))
    }
  }
  onSelect = (file) => {
    console.log(file)
    const { select, cacheKey, compare: { mode, lastSelected } } = this.props
    select({ file, mode, lastSelected, cacheKey })
  }
  changeMode = (mode) => {
    const { changeMode, cacheKey } = this.props
    changeMode({ cacheKey, mode })
  }
  isSelected = (item) => {
    const { compare: { selected1, selected2, mode } } = this.props
    return isSelected({ item, selected1, selected2, mode })
  }
  render() {
    const { compare: { mode, selected1, selected2 }, file, timeline } = this.props
    const { isOpen } = this.state
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])
    const timelineData = get(timeline, 'data', [])
    const revisions = getRevisions(timelineData)
    const displayFileHeader = ['sideBySide', 'aboveAndBelow'].includes(mode)

    return (
      <div className="layout-column flex" style={ { overflow: 'hidden', maxHeight: '100vh' } }>
        <Helmet>
          <title>{ `${file.data.project.name} - ${file.data.path}` }</title>
        </Helmet>
        <div className={ classes.header }>
          <FileBreadCrumbs
            className="text-ellipsis"
            meta={ file.data }
            link
            popup
          />
          <div className="flex" />
          <FileCompareMenu
            file1={ file1 }
            file2={ file2 }
            revisions={ revisions }
            mode={ mode }
            changeMode={ this.changeMode }
          />
          <SimpleIconButton
            className={ classes.sidebarButton }
            onClick={ this.toggleOpen }
            title={ isOpen ? 'Close Sidebar' : 'Open Sidebar' }
          >
            { isOpen ? <MdClose size={ 20 } /> : <MdMenu size={ 20 } /> }
          </SimpleIconButton>
        </div>
        <div className="layout-row flex rel-box">
          <div className={ cn(classes.preview, 'layout-column flex') }>
            <FileCompareInner
              className="layout-column flex"
              project={ file.data.project }
              file1={ file1 }
              file2={ file2 }
              mode={ mode }
              header={ displayFileHeader } 
            />
            <Timeline
              className={ classes.timeline }
              items={ timelineData }
              onSelect={ this.onSelect }
              isSelected={ this.isSelected }
              preferPlace="above"
            />
          </div>
          <aside className={ cn(classes.sidebar, { [classes.isOpen]: isOpen }) }>
            <SectionTitle className={ classes.sidebarTitle }>Meta</SectionTitle>
            <SimpleTable>
              <tr><td>Name</td><td>{file.data.name}</td></tr>
              <tr><td>Size</td><td>{formatBytes(file.data.size)}</td></tr>
              <tr><td>Last modified</td><td>{moment(file.data.modified).fromNow()}</td></tr>
              { revisions.length > 0 &&
              <tr><td>Revisions</td><td>{revisions.length}</td></tr> }
            </SimpleTable>
            <AssemblyParts
              fileMeta={ file }
              clickFn={ this.clickFileOrFolder }
            />
            <SectionTitle className={ classes.sidebarTitle }>Timeline</SectionTitle>
            <TimelineVertical
              items={ timelineData }
              type="file"
            />
          </aside>
        </div>
      </div>
    )
  }
}
