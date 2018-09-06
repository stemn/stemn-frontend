import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cn from 'classnames'
import classes from './FileRow.css'
import bytes from 'stemn-shared/utils/filters/bytes.js'
import FileIcon from './FileIcon'
import Label from 'stemn-shared/misc/Label/Label.jsx'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'
import Link from 'stemn-shared/misc/Router/Link'
import { getFileRouteName, getFileRouteParams } from 'stemn-shared/misc/FileList/FileList.utils'

const ClickFile = (props) => {
  const { link, file, onClick, onDoubleClick, className, children } = props
  if (link) {
    return (
      <Link
        className={ className }
        onClick={ onClick }
        onDoubleClick={ onDoubleClick }
        name={ getFileRouteName(file) }
        params={ getFileRouteParams(file) }
      >
        { children }
      </Link>
    )
  } 
  return (
    <a
      className={ className }
      onClick={ onClick }
      onDoubleClick={ onDoubleClick }
    >
      { children }
    </a>
  )
}


export default class FileRow extends Component {
  static propTypes = {
    singleClick: PropTypes.func,
    doubleClick: PropTypes.func,
    file: PropTypes.object.isRequired,
    query: PropTypes.string,
    isActive: PropTypes.bool,
    link: PropTypes.bool,
    showPath: PropTypes.bool,
  }
  singleClick = () => {
    const { singleClick, file } = this.props
    if (singleClick) {
      singleClick({ file })
    }
  }
  doubleClick = () => {
    const { doubleClick, file } = this.props
    if (doubleClick) {
      doubleClick({ file })
    }
  }
  render() {
    const { isActive, file, query, link, showPath } = this.props

    const timeFromNow = moment(file.modified).fromNow()

    return (
      <div className={ cn(classes.row, 'layout-row layout-align-start-center', { [classes.active]: isActive }) } >
        <ClickFile
          className={ classes.clickOverlay }
          onClick={ this.singleClick }
          onDoubleClick={ this.doubleClick }
          file={ file }
          link={ link }
        />
        <FileIcon fileType={ file.extension } type={ file.type } />
        <div className="text-ellipsis flex">
          <ClickFile
            onClick={ this.singleClick }
            onDoubleClick={ this.doubleClick }
            file={ file }
            link={ link }
          >
            <Highlight
              className={ classes.name }
              text={ showPath ? (file.path || file.name) : file.name }
              query={ query }
            />
          </ClickFile>
        </div>
        { file.commit && file.commit.name && file.commit._id
          ? <div className="flex layout-row">
            <Link
              name="commitRoute"
              params={ { projectId: file.project._id, commitId: file.commit._id } }
              className={ cn(classes.commit, classes.clickable, 'link-primary text-ellipsis') }
            >
              { file.commit.name }
            </Link>
          </div>
          : null }
        <div className={ cn(classes.label, 'hide-xs') }>
          { file.parts && <Label title="Virtual Assembly">Virtual Assembly</Label> }
          { file.revisionNumber > 1 &&
            <Label title={ `${file.revisionNumber} revisions` }>{file.revisionNumber} Revisions</Label>
          }
        </div>
        <div className={ cn(classes.date, 'hide-xs') }>{file.modified ? timeFromNow : ''}</div>
        <div className={ classes.size }>{bytes(file.size)}</div>
      </div>
    )
  }
}
