import React, { Component, PropTypes } from 'react'
import i from 'icepick'

// Styles
import classNames from 'classnames'
import classes from './FileBreadCrumbs.css'

import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'
import Popover from 'stemn-shared/misc/Popover'
import FileListPopup from 'stemn-shared/misc/FileList/FileListPopup'

export default class FileBreadCumbs extends Component {
  static defaultProps = {
    popup: false
  }
  static propTypes = {
    popup: PropTypes.bool,
    clickFn: PropTypes.func,
    meta: PropTypes.object,
  }
  render() {
    const { meta, clickFn, className, popup } = this.props;

    const displayCrumbs = () => {
      if (meta.parents && meta.parents.length > 0) {
        const parentsWithName = i.push(meta.parents, {
          name: meta.name,
          fileId: meta.fileId,
        })
        return parentsWithName.map((folder, idx) => {
          
          const isLastChild = idx == parentsWithName.length - 1
          const parentfolder = parentsWithName[idx - 1]
          
          return parentfolder && popup && idx != 0
          ? <span key={idx}>
              <Popover trigger="hoverDelay"
                preferPlace="below"
                tipSize={ 6 }
                inheritIsOpen
                offset={ 14 }
              >
                <span style={ { display: 'inline-block' } }>
                  { !isLastChild
                  ? <a onClick={ () => clickFn({file: folder}) }>{ middleConcat(folder.name, 30, 0.8) }</a>
                  : <span>{ middleConcat(folder.name, 30, 0.8) }</span> }
                </span>
                <FileListPopup
                  activeFile={ folder.fileId }
                  path={ parentfolder.fileId }
                  provider={ meta.provider }
                  projectId={ meta.project._id }
                  clickFn={ clickFn }
                />
              </Popover>
              { !isLastChild && <span> / </span> }
            </span>
          : <span key={ idx }>
              { !isLastChild
              ? <a onClick={ () => clickFn({ file: folder }) }>{ middleConcat(folder.name, 30, 0.8) }</a>
              : <span>{ middleConcat(folder.name, 30, 0.8) }</span> }
              { !isLastChild && <span> / </span> }
            </span> }
          )
      } else if (meta.name){
        return <span>{ middleConcat(meta.name, 30, 0.8) }</span>
      } else {
        return <span>. . .</span>
      }
    }

    return (
      <div className={ classNames(classes.crumbs, className) }>
        { displayCrumbs() }
      </div>
    );
  }
}
