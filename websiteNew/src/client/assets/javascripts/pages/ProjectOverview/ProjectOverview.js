import React, { Component } from 'react'
import classNames from 'classnames'
import classes from './ProjectOverview.css'
import { projectRoute, fileRoute, projectFolderRoute } from 'route-actions'
import moment from 'moment'
import { has, get } from 'lodash'
import FileList from 'stemn-shared/misc/FileList'
import Readme from 'stemn-shared/misc/Files/Readme/Readme.jsx'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Tag from 'stemn-shared/misc/Tags/Tag'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'
import SubSubHeader from 'modules/SubSubHeader'
import Link from 'stemn-shared/misc/Router/Link'
import { licenseData } from 'stemn-shared/misc/Licenses/Licenses.data'
import MdLocationOn from 'react-icons/md/location-on'
import MdPeople from 'react-icons/md/people'
import MdAccount from 'react-icons/md/account-balance'
import MdAccessTime from 'react-icons/md/access-time'

export default class ProjectOverview extends Component {
  clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId } = file
    const { pushRoute } = this.props
    const projectId = this.props.project.data._id

    if(file.type == 'file'){
      pushRoute(fileRoute({fileId, projectId, revisionId}))
    }
    else if(file.type == 'folder'){
      pushRoute(projectFolderRoute({fileId, projectId}))
    }
    else if(projectId){
      pushRoute(projectRoute({projectId}))
    }
  }

  render() {
    const { entityModel, project, path, files, isFilePage, saveProject } = this.props
    const options = {
      showMenu: true
    }

    if(project && project.data && project.data._id){
      
      const licenseInfo = licenseData.find(license => license.type == project.data.license)
      const projectRouteParams = { projectId: project.data._id }

      const infoBoxes = (
        <Col className={ classNames(project.data.picture ? 'flex flex-gt-xs-33' : 'flex') }>
          <div className={ classNames(project.data.picture ? 'layout-column' : 'layout-xs-column layout-gt-xs-row', classes.infoBoxes)}>
            <div className='flex layout-row layout-align-start-center'>
              <MdAccessTime />
              Updated { moment(project.data.updated).fromNow() }
            </div>
            <div className='flex layout-row layout-align-start-center'>
              <MdPeople />
              <Link name="projectTeamRoute" params={ projectRouteParams }>
                { project.data.team.length === 1
                ? `${project.data.team.length} team member`
                : `${project.data.team.length} team members` }
              </Link>
            </div>
            { has(project, 'data.location[0].name')
              ? <div className='flex layout-row layout-align-start-center'>
                  <MdLocationOn />
                  <div className="text-ellipsis flex">{ project.data.location[0].name }</div>
                </div>
              : null
            }
            { licenseInfo
              ? <div className='flex layout-row layout-align-start-center'>
                <MdAccount />
                <a className="flex text-ellipsis" href={ licenseInfo.url } target="_blank">{ licenseInfo.name }</a>
              </div>
              : null
            }
          </div>
        </Col>
      )
      
      const imageBlock = (
        <Col className="flex">
          <div 
            style={ { backgroundImage: `url(${GLOBAL_ENV.API_SERVER}${project.data.picture})`} }
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
                { project.data.fields.map((field) => (
                  <Link key={ field._id } name="fieldRoute" params={{ fieldId: field.stub }}>
                    <Tag className="primary" text={ field.name } style={ { marginBottom: '6px' } } />
                  </Link>
                ))}
              </div>
              <div className="flex" />
              <div className="layout-row" style={ { marginBottom: '6px' } }>
                <SocialButton
                  style={{marginRight: '10px'}}
                  type="follow"
                  numberModel={`${entityModel}.data.followers`}
                  number={ project.data.followers }
                  entityType="project"
                  entityId={ project.data._id }
                />
                <SocialButton
                  type="like"
                  numberModel={`${entityModel}.data.likes`}
                  number={ project.data.likes }
                  entityType="project"
                  entityId={ project.data._id }
                />
              </div>
            </div>
          </SubSubHeader>
          <Container style={ { marginTop: '30px' } }>
            { !isFilePage 
            ? imageInfoSection 
            : null }
            <FileList
              className={ classes.files }
              projectId={ project.data._id }
              path={ path || '' }
              singleClickFn={ this.clickFileOrFolder }
              doubleClickFn={ this.clickFileOrFolder }
              crumbClickFn={ this.clickFileOrFolder }
              options={ options }
              crumbPopup
              search
            />
            <Readme
              files={ get(files, 'entries', []) }
              project={ project }
              projectModel={ entityModel }
              saveProject={ saveProject }
            />
          </Container>
        </div>
      )
    }
    else{
      return null
    }
  }
}

//            { files && files.entries
//            ?
//            : <div className="text-center text-grey-3" style={ { marginTop: '30px' } }>
//                Add a README.md file to this folder to help others understand what is inside.
//              </div>
//            }
