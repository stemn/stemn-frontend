import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import classes from './FileBreadCrumbs.css'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'
import Popover from 'stemn-shared/misc/Popover'
import FileListPopup from 'stemn-shared/misc/FileList/FileListPopup'
import Link from 'stemn-shared/misc/Router/Link'
import { getFileRouteName, getFileRouteParams } from 'stemn-shared/misc/FileList/FileList.utils'

export default class FileBreadCrumbs extends Component {
  static defaultProps = {
    popup: false,
    clickFn: () => {},
  }
  static propTypes = {
    popup: PropTypes.bool,
    clickFn: PropTypes.func,
    meta: PropTypes.object,
    link: PropTypes.bool, // Should the items be links
  }
  render() {
    const { meta, clickFn, className, popup, link } = this.props
    const hasParents = meta.parents && meta.parents.length > 0
    
    const displayCrumbs = () => {
      if (hasParents) {
        const parentsExtended = [
          ...meta.parents.map(parent => ({
            name: parent.name,
            fileId: parent.fileId,
            project: {
              _id: meta.project._id,
            },
            type: 'folder',
          })),
          {
            name: meta.name,
            fileId: meta.fileId,
            project: {
              _id: meta.project._id,
            },
            type: 'file',
          },
        ]
        return parentsExtended.map((folder, idx) => {
          const isLastChild = idx === parentsExtended.length - 1
          const parentfolder = parentsExtended[idx - 1]
          const clickableText = link
            ? (<Link
              onClick={ () => clickFn({ file: folder }) }
              name={ getFileRouteName(folder) }
              params={ getFileRouteParams(folder) }
            >
              { middleConcat(folder.name, 30, 0.8) }
            </Link>)
            : <a onClick={ () => clickFn({ file: folder }) }>{ middleConcat(folder.name, 30, 0.8) }</a>
          
          const plainText = <span>{ middleConcat(folder.name, 30, 0.8) }</span>

          const getPopoverCrumb = () => (
            <span key={ idx }>
              <Popover
                trigger="hoverDelay"
                preferPlace="below"
                tipSize={ 6 }
                inheritIsOpen
                offset={ 14 }
              >
                <span style={ { display: 'inline-block' } }> { !isLastChild ? clickableText : plainText }</span>
                <FileListPopup
                  activeFile={ folder.fileId }
                  path={ parentfolder.fileId }
                  provider={ meta.provider }
                  projectId={ meta.project._id }
                  clickFn={ clickFn }
                  link={ link }
                />
              </Popover>
              { !isLastChild && <span> / </span> }
            </span>
          )

          const getPlainCrumb = () => (
            <span key={ idx }>
              { !isLastChild ? clickableText : plainText }
              { !isLastChild && <span> / </span> }
            </span>
          )
          return parentfolder && popup && idx !== 0
            ? getPopoverCrumb()
            : getPlainCrumb()
        })
      } else if (meta.name) {
        return <span>{ middleConcat(meta.name, 30, 0.8) }</span>
      } 
      return <span>. . .</span>
    }

    return (
      <div className={ cn(classes.crumbs, className) }>
        { displayCrumbs() }
      </div>
    )
  }
}
