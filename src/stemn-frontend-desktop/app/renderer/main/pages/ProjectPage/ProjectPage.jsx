// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as SystemActions from 'stemn-shared/desktop/System/System.actions.js'

// Component Core
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'stemn-shared/misc/Router/Link'
import { get } from 'lodash'

import Header from 'stemn-shared/misc/Header/Header.jsx'
import Banner from 'stemn-shared/misc/Banner/Banner.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdSettings from 'react-icons/md/settings'
import MdExpandMore from 'react-icons/md/expand-more'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import PopoverDetails from 'stemn-shared/misc/PopoverMenu/PopoverDetails'
import ProjectMenu from 'stemn-shared/misc/Projects/Project.menu.js'
import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import folderLockedVector  from 'stemn-shared/assets/images/pure-vectors/folder-locked.svg'
import globalVector  from 'stemn-shared/assets/images/pure-vectors/global.svg'

import classes from './ProjectPage.css'

class Component extends React.Component {
  getChildContext() {
    return {
      project: this.props.project,
    }
  }
  componentWillMount() {
    this.props.ProjectsActions.getProject({ projectId: this.props.params.stub })
    this.props.ProjectsActions.setActiveProject({ projectId: this.props.params.stub })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.stub !== this.props.params.stub) {
      this.props.ProjectsActions.getProject({ projectId: nextProps.params.stub })
      this.props.ProjectsActions.setActiveProject({ projectId: nextProps.params.stub })
    }
  }
  render() {
    const {
      project,
      system,
      children,
      systemActions,
      dispatch,
    } = this.props
    const baseLink       = `project/${project && project.data ? project.data._id : ''}`
    const isLoading      = !project || !project.data
    const isConnected    = project && project.data && project.data.remote && project.data.remote.provider
    const hasName        = project && project.data && project.data.name
    const routeName      = this.props.routes[this.props.routes.length - 1]

    const downloadLinks = {
      drive: 'https://tools.google.com/dlpage/drive/index.html',
      dropbox: 'https://www.dropbox.com/downloading',
    }

    const menu = [{
      label: 'Project Settings',
      onClick: () => {},
    }, {
      label: 'Delete Projects',
      onClick: this.deleteThread,
    }]

    const missingClientBanner = () => {
      const provider   = project.data.remote.provider
      const capitalize = { textTransform: 'capitalize' }
      const underline  = { textDecoration: 'underline' }
      if (provider && !system.providerPath[provider]) {
        return (
          <Banner type="warn">
            Could not find <span style={ capitalize }>{provider}</span> on your computer.
            The <span style={ capitalize }>{provider}</span> desktop client must be installed for this project to sync to your computer.
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style={ Object.assign({}, underline, capitalize) } href={ downloadLinks[provider] }>Download {provider}</a>
            &nbsp;or&nbsp;
            <a style={ underline } onClick={ systemActions.getProviderPath }>Check again.</a>
          </Banner>
        )
      }
      
      return null
    }

    const getVisibilityPopup = () => (get(project, 'data.private')
      ? <PopoverDetails>
        <div className="header">Private project</div>
        <div className="body" style={ { paddingTop: '5px' } }>
          <div className="layout-row layout-align-center"><img src={ folderLockedVector } style={ { height: '80px' } } /></div>
          <p>Your project data is private - it will not be publicly accessible on stemn.com.</p>
          <p>Consider open-sourcing this project or upgrading to Stemn Pro to access additional features such as infinite revision history.</p>
        </div>
        <div className="footer layout-row">
          <Link className="link-primary" name="webProjectRoute" params={ { projectId: get(project, 'data._id') } }>View online</Link>
          <div className="flex" />
          <Link className="link-grey" to={ `${baseLink}/settings/permissions` }>Change</Link>
        </div>
      </PopoverDetails>
      : <PopoverDetails>
        <div className="header">Public Project</div>
        <div className="body" style={ { paddingTop: '5px' } }>
          <div className="layout-row layout-align-center"><img src={ globalVector } style={ { height: '80px' } } /></div>
          <p>Your project data is public - it will be accessible on stemn.com.</p>
          <p>Your data and files will be visible to everyone - only team-members can edit.</p>
        </div>
        <div className="footer layout-row">
          <Link className="link-primary" name="webProjectRoute" params={ { projectId: get(project, 'data._id') } }>View online</Link>
          <div className="flex" />
          <Link className="link-grey" to={ `${baseLink}/settings/permissions` }>Change</Link>
        </div>
      </PopoverDetails>)

    return (
      <div className="layout-column flex rel-box">
        <div className="layout-column flex">
          <Header>
            <Popover preferPlace="below" tipSize={ 6 }>
              <a className={ `${classes.title} text-ellipsis` }>{hasName ? project.data.name : ''}<MdExpandMore style={ { marginLeft: '5px' } } size="18px" /></a>
              <PopoverMenuList item={ project && project.data ? project.data : {} } menu={ ProjectMenu(dispatch) } />
            </Popover>

            <div className={ `${classes.tabs} flex layout-row layout-align-start-center` }>
              <Link activeClassName="active" to={ baseLink } onlyActiveOnIndex>Changes</Link>
              { isConnected ? <Link activeClassName="active" to={ `${baseLink}/feed` }>History</Link> : null }
              <Link activeClassName="active" to={ `${baseLink}/threads` }>Threads</Link>
              { isConnected ? <Link className={ ['files/:path', 'files'].includes(routeName.path) ? 'active' : '' } to={ `${baseLink}/files/` }>Files</Link> : null }
            </div>
            <Popover preferPlace="below" tipSize={ 6 } trigger="click">
              <SimpleIconButton title="Visibility Settings">
                <PublicPrivateIcon private={ get(project, 'data.private') } size={ 20 } />
              </SimpleIconButton>
              { getVisibilityPopup() }
            </Popover>
            <div className="divider" />
            <SimpleIconButton activeClassName="active" to={ `${baseLink}/settings` } title="Project Settings">
              <MdSettings size={ 20 } />
            </SimpleIconButton>
            <div className="divider" />
          </Header>
          { isConnected
            ? missingClientBanner()
            : null }
          <div className="layout-column flex rel-box">
            { !isLoading
              ? children
              : null }
            <LoadingOverlay show={ isLoading } />
          </div>
        </div>
      </div>
    )
  }
}


Component.childContextTypes = {
  project: PropTypes.object,
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ system }) {
  return {
    system,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(SystemActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
