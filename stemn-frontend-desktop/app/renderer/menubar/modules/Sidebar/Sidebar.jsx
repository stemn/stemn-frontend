import { connect } from 'react-redux'
import { toggleMenubarSidebar } from 'stemn-shared/misc/Sidebar/Sidebar.actions.js'
import React from 'react'
import { escapeRegExp, orderBy } from 'lodash'
import cn from 'classnames'
import classes from './Sidebar.css'
import AnimateShow from 'stemn-shared/misc/AnimateShow/AnimateShow.jsx'
import SidebarProjectButton from 'stemn-shared/misc/Sidebar/SidebarProjectButton.jsx'
import MdSearch from 'react-icons/md/search'
import Input from 'stemn-shared/misc/Input/Input/Input'

export class Component extends React.Component {
  render() {
    const { projects, sidebar, dispatch } = this.props

    const linkProject = item => ({
      pathname: `/project/${item._id}`,
      state: { meta: { scope: ['main', 'menubar'] } },
    })

    const nameRegex = new RegExp(escapeRegExp(sidebar.searchString), 'i')
    const filteredProjects = projects && projects.data ? projects.data.filter(project => nameRegex.test(project.name)) : []
    const filteredProjectsOrdered = orderBy(filteredProjects, 'updated', 'desc')

    return (
      <div className="scroll-dark">
        <AnimateShow show={ sidebar.showMenubar } animation={ classes.animateOverlay } animationShow={ classes.animateOverlayShow }>
          <div className={ classes.overlay } onClick={ () => dispatch(toggleMenubarSidebar(false)) } />
        </AnimateShow>
        <div className={ cn(classes.sidebar, 'layout-column', { [classes.sidebarShow]: sidebar.showMenubar }) }>
          <div className={ classes.sidebarSearch }>
            <Input
              model="sidebar.searchString"
              value={ sidebar.searchString }
              className="dr-input text-ellipsis"
              type="text"
              placeholder="Search all projects"
            />
            <MdSearch className={ classes.sidebarSearchIcon } size="20" />
          </div>
          <div className="flex scroll-box">
            {filteredProjectsOrdered.map(item =>
              <SidebarProjectButton item={ item } to={ linkProject(item) } clickFn={ () => dispatch(toggleMenubarSidebar(false)) } />,
            )}
          </div>
        </div>
      </div>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ projects, sidebar, auth }) {
  return {
    sidebar,
    projects: projects.userProjects[auth.user._id],
  }
}

export default connect(mapStateToProps)(Component)
