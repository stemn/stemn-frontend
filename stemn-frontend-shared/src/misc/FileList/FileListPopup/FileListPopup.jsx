import React, { Component } from 'react'
import { orderBy, omit } from 'lodash'
import cn from 'classnames'
import classes from './FileListPopup.module.css'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import FileIcon from 'stemn-shared/misc/FileList/components/FileIcon'
import Link from 'stemn-shared/misc/Router/Link'
import { getFileRouteName, getFileRouteParams } from 'stemn-shared/misc/FileList/FileList.utils'

const FileRow = (props) => {
  const { file, isActive, clickFn, link } = props
  const rowClasses = cn(classes.file, { [classes.active]: isActive }, 'layout-row layout-align-start-center')
  if (link) {
    return (
      <Link
        className={rowClasses}
        onClick={() => clickFn({ file })}
        name={getFileRouteName(file)}
        params={getFileRouteParams(file)}
      >
        <FileIcon fileType={file.extension} type={file.type} size={20} />
        <div className="text-ellipsis">{file.name}</div>
      </Link>
    )
  }
  return (
    <div className={rowClasses} onClick={() => clickFn({ file })}>
      <FileIcon fileType={file.extension} type={file.type} size={20} />
      <div className="text-ellipsis">{file.name}</div>
    </div>
  )
}

const ownPropKeys = [
  'activeFile',
  'clickFn',
  'path',
  'provider',
  'projectId',
  'link',
  'isOpen',
  'fileList',
  'fileListCacheKey',
  'getFiles',
]
export default class FileListPopup extends Component {
  render() {
    const { link, fileList, activeFile, clickFn } = this.props
    const isLoading = !fileList || fileList.loading
    const filesOrdered = fileList && fileList.entries ? orderBy(fileList.entries, 'name') : []
    const filesOnly = filesOrdered.filter((file) => file.type === 'file')
    const foldersOnly = filesOrdered.filter((file) => file.type === 'folder')

    return (
      <div {...omit(this.props, ownPropKeys)} className={classes.popup}>
        <LoadingOverlay show={isLoading} linear noOverlay />
        {foldersOnly &&
          foldersOnly.map((file) => (
            <FileRow key={file._id} file={file} isActive={file.fileId === activeFile} clickFn={clickFn} link={link} />
          ))}
        {foldersOnly && filesOnly && <div className={classes.divider} />}
        {filesOnly &&
          filesOnly.map((file) => (
            <FileRow key={file._id} file={file} isActive={file.fileId === activeFile} clickFn={clickFn} link={link} />
          ))}
      </div>
    )
  }
}
