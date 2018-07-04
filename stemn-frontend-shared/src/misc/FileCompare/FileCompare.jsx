import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import classes from './FileCompare.css'
import { orderItemsByTime, isSelected } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import TogglePanel from 'stemn-shared/misc/TogglePanel/TogglePanel.jsx'
import DragResize from 'stemn-shared/misc/DragResize/DragResize.jsx'
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner.jsx'
import Timeline from 'stemn-shared/misc/Timeline/Timeline.jsx'
import { get } from 'lodash'

export default class FileCompare extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,                           // Is it open ( to be used with collapse )
    type: PropTypes.oneOf(['collapse', undefined]),
  }
  onSelect = (file) => {
    const { select, syncTimelineCacheKey, compare: { mode, lastSelected } } = this.props
    select({
      file,
      mode,
      lastSelected,
      cacheKey: syncTimelineCacheKey,
    })
  }
  changeMode = (mode, revisions) => {
    const { changeMode, syncTimelineCacheKey } = this.props
    changeMode({
      cacheKey: syncTimelineCacheKey,
      mode,
    })
  }
  isSelected = (item) => {
    const { compare: { selected1, selected2, mode } } = this.props
    return isSelected({
      item,
      selected1,
      selected2,
      mode,
    })
  }
  render() {
    const { compare: { mode, selected1, selected2 }, file, project, togglePanelCacheKey, type, className } = this.props
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])

    const collapseTemplate = () => (
      <div className={ className }>
        <TogglePanel cacheKey={ togglePanelCacheKey }>
          <div className="text-ellipsis text-grey-4">{ file.data.path }</div>
          <FileCompareMenu
            file1={ file1 }
            file2={ file2 }
            revisions={ file.revisions }
            mode={ mode }
            changeMode={ this.changeMode }
            enablePreview
          />
          <DragResize
            side="bottom"
            height="500"
            heightRange={ [0, 1000] }
            className="layout-column flex"
          >
            <FileCompareInner
              project={ project.data }
              event={ selected1 }
              file1={ file1 }
              file2={ file2 }
              mode={ mode }
            />
            { file.revisions.length > 1
              ? <Timeline
                className={ classes.timeline }
                size="sm"
                onSelect={ this.onSelect }
                isSelected={ this.isSelected }
                items={ file.revisions }
                preferPlace="above"
              />
              : null }
          </DragResize>
        </TogglePanel>
      </div>
    )

    const standardTemplate = () => (
      <div className={ cn('layout-column flex', className) }>
        <div className={ `${classes.header} layout-row layout-align-start-center` }>
          <div className="flex">{ file.data.path }</div>
          <FileCompareMenu
            file1={ file1 }
            file2={ file2 }
            revisions={ file.revisions }
            mode={ mode }
            changeMode={ this.changeMode }
            enablePreview
          />
        </div>
        <div className="layout-column flex">
          <FileCompareInner
            project={ project }
            event={ selected1 }
            file1={ file1 }
            file2={ file2 }
            mode={ mode }
            header={ ['sideBySide', 'aboveAndBelow'].includes(mode) }
          />
        </div>
        <Timeline
          className={ classes.timeline }
          size="sm"
          onSelect={ this.onSelect }
          isSelected={ this.isSelected }
          items={ file.revisions }
          preferPlace="above"
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

