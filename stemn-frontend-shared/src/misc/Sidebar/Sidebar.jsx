import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SidebarActions            from 'stemn-shared/misc/Sidebar/Sidebar.actions.js'
import * as AuthActions               from 'stemn-shared/misc/Auth/Auth.actions.js'
import * as ProjectsActions           from 'stemn-shared/misc/Projects/Projects.actions.js'
import * as ModalActions              from 'stemn-shared/misc/Modal/Modal.actions.js'
import * as SystemActions             from 'stemn-shared/desktop/System/System.actions.js'
import { push } from 'react-router-redux'
import React from 'react'
import { escapeRegExp, orderBy }      from 'lodash'
import cn                     from 'classnames'
import styles                         from './Sidebar.css'
import userStyles                     from './SidebarAvatar.css'
import DragResize                     from 'stemn-shared/misc/DragResize/DragResize.jsx'
import { Link }                       from 'react-router'
import { ContextMenuTrigger }         from 'react-contextmenu'
import Popover                        from 'stemn-shared/misc/Popover'
import Input                          from 'stemn-shared/misc/Input/Input/Input'
import ContextMenu                    from 'stemn-shared/misc/ContextMenu/ContextMenu.jsx'
import SidebarProjectButton           from './SidebarProjectButton.jsx'
import SimpleIconButton               from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMenu                         from 'react-icons/md/menu'
import MdSearch                       from 'react-icons/md/search'
import MdSettings                     from 'react-icons/md/settings'
import MdAdd                          from 'react-icons/md/add'
import ProjectMenu                    from 'stemn-shared/misc/Projects/Project.menu.js'
import UserAvatar                     from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  showProjectNewModal = () => {
    this.props.modalActions.showModal({ modalType: ProjectNewModalName })
  };

  secretSearch = () => {
    if (this.props.sidebar.searchString.length === 24) {
      this.props.dispatch(push(`/project/${this.props.sidebar.searchString}`))
    }
  };

  render() {
    const { projectsActions, projects, auth, dispatch } = this.props
    const sidebarStyle = cn('layout-column', 'flex', 'rel-box', styles.sidebar)
    const nameRegex = new RegExp(escapeRegExp(this.props.sidebar.searchString), 'i')
    const filteredProjects = projects && projects.data
      ? projects.data.filter(project => nameRegex.test(project.name))
      : []
    const filteredProjectsOrdered = orderBy(filteredProjects, 'updated', 'desc')

    return (
      <DragResize
        side="right"
        width="300"
        widthRange={ [0, 500] }
        animateHide={ !this.props.sidebar.show }
        className="layout-column flex scroll-dark"
      >
        <div className={ sidebarStyle }>
          <div className={ `${styles.sidebarToolbar} layout-row layout-align-start-center` }>
            <SimpleIconButton
              className={ styles.sideBarIcon }
              title="Create new project"
              onClick={ this.showProjectNewModal }
            >
              <MdAdd size="25" />
            </SimpleIconButton>
            <div className="flex" />
            <SimpleIconButton
              title="Toggle sidebar"
              className={ styles.sideBarIcon }
              onClick={ () => this.props.sidebarActions.toggleSidebar() }
            >
              <MdMenu size="25" />
            </SimpleIconButton>
          </div>
          <div className="layout-column flex">
            <div className={ styles.sidebarSearch }>
              <Input
                model="sidebar.searchString"
                value={ this.props.sidebar.searchString }
                className="dr-input text-ellipsis"
                type="text"
                placeholder="Search all projects"
              />
              <MdSearch
                className={ styles.sidebarSearchIcon }
                size="25"
                onClick={ this.secretSearch }
              />
            </div>
            <div className="scroll-box flex">
              { projects && projects.data && projects.data.length === 0
                ? <SidebarProjectButton
                  item={ { name: 'Create a project' } }
                  clickFn={ this.showProjectNewModal }
                />
                : null }
              { filteredProjectsOrdered.length > 0
                ? <div style={ { padding: '10px 15px 5px', opacity: '0.7' } }>My Projects</div>
                : null }
              { filteredProjectsOrdered.map((item, idx) =>
                <ContextMenuTrigger
                  id={ projectContextIdentifier }
                  key={ item._id }
                  item={ item }
                >
                  <SidebarProjectButton
                    item={ item }
                    isActive={ item._id === this.props.params.stub }
                    to={ `/project/${item._id}` }
                  />
                </ContextMenuTrigger>,
              )}
              <ContextMenu
                identifier={ projectContextIdentifier }
                menu={ ProjectMenu(dispatch) }
              />
            </div>
          </div>
          <div>
            <div className={ `${styles.footer} layout-row layout-align-start-center` }>
              <Popover>
                <a className="flex">
                  <div className={ `${userStyles.userWrapper} flex layout-row layout-align-start-center` }>
                    <UserAvatar
                      picture={ this.props.auth.user.picture }
                      name={ this.props.auth.user.name }
                      className={ userStyles.userAvatar }
                    />
                    <div className="flex text-ellipsis">
                      {this.props.auth.user.name}
                    </div>
                  </div>
                </a>
                <div className="PopoverMenu">
                  <a href="#/settings/application">Application Settings</a>
                  <a href="#/settings/account">Account Settings</a>
                  <a onClick={ () => { this.props.authActions.logout() } }>Sign out</a>
                </div>
              </Popover>
              <Link
                className={ `${userStyles.userSettings} layout-column layout-align-center-center` }
                to="/settings/application"
              >
                <MdSettings size="25" />
              </Link>
            </div>
          </div>
        </div>
      </DragResize>
    )
  }
}

//              <div className="text-grey-3" style={{padding: '10px 15px 5px'}}>Other Projects</div>
//              <SidebarProjectButton  item={{name: 'Demo Project'}} icon="tutorial" />


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ sidebar, auth, projects }, { params }) {
  return {
    sidebar,
    auth,
    params,
    projects: projects.userProjects[auth.user._id],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
    systemActions: bindActionCreators(SystemActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
