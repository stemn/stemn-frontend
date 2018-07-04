import React, { Component } from 'react'
import cn from 'classnames'
import classes from './ProjectOverview.css'
import { projectRoute, fileRoute, projectFolderRoute } from 'route-actions'
import moment from 'moment'
import { has, get } from 'lodash'
import FileList from 'stemn-shared/misc/FileList'
import Readme from 'stemn-shared/misc/Files/Readme/Readme.jsx'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Tag from 'stemn-shared/misc/Tags/Tag'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'
import SubSubHeader from 'modules/SubSubHeader'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import { licenseData } from 'stemn-shared/misc/Licenses/Licenses.data'
import MdLocationOn from 'react-icons/md/location-on'
import MdPeople from 'react-icons/md/people'
import MdAccount from 'react-icons/md/account-balance'
import MdAccessTime from 'react-icons/md/access-time'
import MdCompareArrows from 'react-icons/md/compare-arrows'

export default class ProjectOverview extends Component {
  clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId } = file
    const { pushRoute } = this.props
    const projectId = this.props.project.data._id

    if (file.type == 'file') {
      pushRoute(fileRoute({ fileId, projectId, revisionId }))
    } else if (file.type == 'folder') {
      pushRoute(projectFolderRoute({ fileId, projectId }))
    } else if (projectId) {
      pushRoute(projectRoute({ projectId }))
    }
  }

  render() {
    const { canEdit, entityModel, project, changesCount, path, files, isFilePage, saveProject } = this.props
    const isConnected = get(project, 'data.remote.connected', false)

    const options = {
      showMenu: true,
    }

    if (project && project.data && project.data._id) {
      const licenseInfo = licenseData.find(license => license.type == project.data.license)
      const projectRouteParams = { projectId: project.data._id }

      const infoBoxes = (
        <Col className={ cn(project.data.picture ? 'flex flex-gt-xs-33' : 'flex') }>
          <div className={ cn(project.data.picture ? 'layout-column' : 'layout-xs-column layout-gt-xs-row', classes.infoBoxes) }>
            <div className="flex layout-row layout-align-start-center" style={ { padding: '15px 20px' } }>
              <MdPeople />
              Team
              <div className="flex" />
              <Link name="projectTeamRoute" params={ projectRouteParams }>
                <UserAvatars className="layout-row" shape="square" size={ 30 } users={ project.data.team } limit={ 5 } />
              </Link>
            </div>
            <div className="flex layout-row layout-align-start-center">
              <MdAccessTime />
              Updated { moment(project.data.updated).fromNow() }
            </div>
            { has(project, 'data.location[0].name')
              ? <div className="flex layout-row layout-align-start-center">
                <MdLocationOn />
                <div className="text-ellipsis flex">{ project.data.location[0].name }</div>
              </div>
              : null
            }
            { licenseInfo
              ? <div className="flex layout-row layout-align-start-center">
                <MdAccount />
                <a className="flex text-ellipsis" href={ licenseInfo.url } target="_blank">{ licenseInfo.name }</a>
              </div>
              : null
            }
            { changesCount && changesCount > 0 ?
              <div className="flex layout-row layout-align-start-center">
                <MdCompareArrows />
                { changesCount } uncommited changes
              </div>
              : null
            }
          </div>
        </Col>
      )
      
      const imageBlock = (
        <Col className="flex">
          <div 
            style={ { backgroundImage: `url(${GLOBAL_ENV.API_SERVER}${project.data.picture})` } }
            className={ classes.image  }
          />
        </Col>
      )
      
      const imageInfoSection = (
        <Row className="layout-xs-column layout-gt-xs-row" style={ { marginBottom: '30px' } } >
          { project.data.picture ? imageBlock : null }
          { infoBoxes }
        </Row>
      )

      return (
        <div style={ { marginBottom: '30px' } }>
          <SubSubHeader>
            { project.data.blurb.length > 0
              ? <div className={ classes.blurb }>{ project.data.blurb }</div>
              : null }
            <div className="layout-xs-column layout-gt-xs-row layout-align-gt-xs-start-center">
              <div className={ classes.tags }>
                { project.data.fields.map(field => (
                  <Link key={ field._id } name="fieldRoute" params={ { fieldId: field.stub } }>
                    <Tag className="primary" text={ field.name } style={ { marginBottom: '6px' } } />
                  </Link>
                ))}
              </div>
              <div className="flex" />
              <div className="layout-row" style={ { marginBottom: '6px' } }>
                <SocialButton
                  style={ { marginRight: '10px' } }
                  type="follow"
                  numberModel={ `${entityModel}.data.numFollowers` }
                  number={ project.data.numFollowers }
                  entityType="project"
                  entityId={ project.data._id }
                />
                <SocialButton
                  type="like"
                  numberModel={ `${entityModel}.data.numLikes` }
                  number={ project.data.numLikes }
                  entityType="project"
                  entityId={ project.data._id }
                />
                { !canEdit && (
                  <SocialButton
                    style={ { marginLeft: '10px' } }
                    type="clone"
                    numberModel={ `${entityModel}.data.numClones` }
                    number={ project.data.numClones }
                    entityType="project"
                    entityId={ project.data._id }
                  />
                )}
              </div>
            </div>
          </SubSubHeader>
          <Container style={ { margin: '30px auto' } }>
            { !isFilePage 
              ? imageInfoSection 
              : null }
            { isConnected &&
              <FileList
                className={ classes.files }
                initialSync={ !project.data.remote.lastSynced }
                projectId={ project.data._id }
                path={ path || '' }
                crumbClickFn={ this.clickFileOrFolder }
                options={ options }
                crumbPopup
                search
                link
              />
            }
            <Readme
              files={ get(files, 'entries', []) }
              project={ project }
              projectModel={ entityModel }
              saveProject={ saveProject }
              isRoot={ !path || path === '' }
              canEdit={ canEdit }
            />
          </Container>
        </div>
      )
    }
    
    return null
  }
}

//            { files && files.entries
//            ?
//            : <div className="text-center text-grey-3" style={ { marginTop: '30px' } }>
//                Add a README.md file to this folder to help others understand what is inside.
//              </div>
//            }
