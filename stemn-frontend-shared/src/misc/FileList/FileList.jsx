import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { orderBy, get } from 'lodash'
import cn from 'classnames'
import classes from './FileList.css'
import FileBreadCrumbs from './components/FileBreadCrumbs'
import FileRow from './components/FileRow'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdRefresh from 'react-icons/md/refresh'
import MdHome from 'react-icons/md/home'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import { ContextMenuTrigger } from 'react-contextmenu'
import ContextMenu from 'stemn-shared/misc/ContextMenu/ContextMenu.jsx'
import FileListMenu from './FileList.menu.js'
import FlipMove from 'react-flip-move/dist/react-flip-move.js'
import AccordianAnimate from 'stemn-shared/misc/Animation/AccordianAnimate'
import ChildrenHistory from 'stemn-shared/misc/Animation/ChildrenHistory'
import FileSyncUnderway from 'stemn-shared/misc/FileList/FileSyncUnderway'


const contextIdentifier = 'FileListCm'
const FileRowContext = GLOBAL_ENV.APP_TYPE === 'web'
  ? FileRow
  : props => (
    <ContextMenuTrigger id={ contextIdentifier } item={ props.file } data="test">
      <FileRow { ...props } />
    </ContextMenuTrigger>
  )


// /////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  projectId: PropTypes.string,             // Optional: The project id (this is used if we are not exploring a provider)
  path: PropTypes.string,             // The current fileId: This folder will be opened when the modal inits.
  singleClickFn: PropTypes.func,               // When a file is single clicked
  doubleClickFn: PropTypes.func,               // When a file is double clicked
  crumbClickFn: PropTypes.func,               // When a crumb is clicked
  selected: PropTypes.object,             // The currently selected file
  contentStyle: PropTypes.object,             // Styles for the content section
  initialSync: PropTypes.bool,         // Optional: True if this is the initial project sync (general uses !project.remote.lastSynced)
  crumbPopup: PropTypes.bool,         // Optional: Should we show a popup on the crumbs?
  search: PropTypes.bool,         // Optional: Should search be enabled
  link: PropTypes.bool,         // Optional: Should each row be a link with href
  options: PropTypes.shape({
    allowFolder: PropTypes.bool,
    foldersOnly: PropTypes.bool,
    showMenu: PropTypes.bool,
    explore: PropTypes.string,       // Optional: 'dropbox' || 'drive' - The provider
  }),
  dispatch: PropTypes.func,               // Actions
  fileList: PropTypes.object,           // Store
}

export default class FileList extends Component {
  static propTypes = propTypesObject
  refresh = () => {
    const { getFiles, options, path, projectId, fileListCacheKey } = this.props
    getFiles({
      path,
      provider: options.explore,
      projectId,
      cacheKey: fileListCacheKey,
    })
  }

  goHome = () => {
    const { crumbClickFn, projectId } = this.props
    crumbClickFn({
      file: {
        fileId: '',
        project: {
          _id: projectId,
        },
      },
    })
  }
  renderResults = (isLoading) => {
    const { fileList, options, selected, singleClickFn, doubleClickFn, link } = this.props
    const filesNormal = get(fileList, 'entries', [])
    const filesFiltered = options.foldersOnly
      ? filesNormal.filter(file => file.type === 'folder')
      : filesNormal
    const filesOrdered  = orderBy(filesFiltered, ['type', ({ name }) => name.toLowerCase()], ['desc', 'asc'])

    if (filesOrdered && filesOrdered.length > 0) {
      return filesOrdered.map(file => (
        <FileRowContext
          key={ file.fileId }
          file={ file }
          singleClick={ singleClickFn }
          doubleClick={ doubleClickFn }
          isActive={ selected && selected.fileId === file.fileId }
          link={ link }
        />
      ))
    } else if (isLoading === false) {
      return <div className="text-title-5" style={ { padding: '15px' } }>No results</div>
    }
    return null
  }
  componentWillMount() {
    this.fileRowHistory = new ChildrenHistory()
  }
  renderSearchResults = (isLoading) => {
    const { fileList, options, selected, singleClickFn, doubleClickFn } = this.props
    const filesNormal = get(fileList, 'search', [])
    const filesFiltered = options.foldersOnly
      ? filesNormal.filter(file => file.type === 'folder')
      : filesNormal
    const filesOrdered  = orderBy(filesFiltered, ['type', ({ name }) => name.toLowerCase()], ['desc', 'asc'])

    if (filesOrdered && filesOrdered.length > 0) {
      return filesOrdered.map(file => (
        <FileRowContext
          key={ file.fileId }
          query={ fileList.query }
          file={ file }
          singleClick={ singleClickFn }
          doubleClick={ doubleClickFn }
          isActive={ selected && selected.fileId === file.fileId }
          showPath
        />
      ))
    } else if (isLoading === false) {
      return <div className="text-title-5" style={ { padding: '15px' } }>No results</div>
    }
    return null
  }
  render() {
    const { fileList, fileListCacheKey, getFiles, getSearchResults, link, initialSync, search, contentStyle, singleClickFn, doubleClickFn, crumbClickFn, selected, options, path, projectId, crumbPopup, dispatch, ...otherProps } = this.props

    const isLoading = !fileList || fileList.loading
    const isInitialSync = !get(fileList, 'folder') && initialSync

    const fileRowChildren = get(fileList, 'query', '').length > 0
      ? this.renderSearchResults(isLoading)
      : this.renderResults(isLoading)

    const fileRowHistoryShouldUpdate = !isLoading
    const fileRowHistoric = this.fileRowHistory.get(fileRowChildren, fileRowHistoryShouldUpdate)
    
    const provider = get(fileList, 'search.[0].provider') || get(fileList, 'entries.[0].provider')

    return (
      <div { ...otherProps }>
        { isInitialSync
          ? <div className="rel-box">
            <LoadingOverlay
              show={ isLoading }
              linear
              hideBg
              noOverlay
            />
            <FileSyncUnderway
              refresh={ this.refresh }
            />
          </div>
          : <div>
            <div className={ `${classes.breadcrumbs} layout-row layout-align-start-center` }>
              <FileBreadCrumbs
                className="flex"
                meta={ get(fileList, 'folder', {}) }
                clickFn={ crumbClickFn }
                popup={ crumbPopup }
              />
              <SimpleIconButton
                onClick={ this.goHome }
                title="Home"
              >
                <MdHome size={ 22 } />
              </SimpleIconButton>
              <SimpleIconButton
                onClick={ this.refresh }
                title="Refresh"
              >
                <MdRefresh size={ 22 } />
              </SimpleIconButton>
              { search
                ? <SearchInput
                  value={ fileList.query }
                  model={ `fileList.${fileListCacheKey}.query` }
                  className={ cn(classes.search, 'hide-xs') }
                  placeholder="Search Files"
                />
                : null }

            </div>
            <div
              className="rel-box"
              style={ contentStyle }
            >
              <LoadingOverlay
                show={ isLoading }
                linear
                hideBg
                noOverlay
              />
              <AccordianAnimate
                duration={ 300 }
                itemHeight={ 48 }
                items={ fileRowHistoric }
              >
                <FlipMove
                  duration={ 300 }
                  enterAnimation="fade"
                  leaveAnimation="fade"
                >
                  { fileRowHistoric }
                </FlipMove>
              </AccordianAnimate>
              { options.showMenu
                ? <ContextMenu
                  identifier={ contextIdentifier }
                  menu={ FileListMenu(dispatch, provider) }
                />
                : null }
            </div>
          </div> }
      </div>
    )
  }
}
