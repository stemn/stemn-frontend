import React, { Component } from 'react'

import cn from 'classnames'
import classes from './ProjectCommit.css'

import { groupRevisions }  from 'stemn-shared/misc/Timeline/Timeline.utils.js'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import FileCompare from 'stemn-shared/misc/FileCompare'
import SubSubHeader from 'modules/SubSubHeader'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import Link from 'stemn-shared/misc/Router/Link'

export default class ProjectCommit extends Component {
  renderLoaded() {
    const { commit: { data: commit }, project, projectId } = this.props
    
    const groupedRevisions = groupRevisions(commit.revisions.map(revision => ({ data: revision })))

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectCommitsRoute" params={ { projectId } } text="History" />
            <Crumb name="projectCommitsRoute" params={ { projectId } } query={ { type: 'commits' } } text="Commits" />
            <Crumb text={ commit.name } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ commit.name }</span>
            <span className={ classes.number }>&nbsp;#C{ commit.commitNumber }</span>
          </h2>
          <div className={ classes.blurb }>
            <EditorDisplay value={ commit.body } />
          </div>
          <div className={ cn('layout-row layout-align-start-center', classes.meta) }>
            <Link
              name="userRoute"
              params={ { userId: commit.owner._id } }
            >
              <UserAvatar
                className={ classes.avatar }
                name={ commit.owner.name }
                picture={ commit.owner.picture }
                size={ 20 }
                shape="square"
              />
            </Link>
            <div className="text-ellipsis">
              <Link
                name="userRoute"
                params={ { userId: commit.owner._id } }
              >
                <b>{ commit.owner.name }</b>
              </Link>
              &nbsp;commited { groupedRevisions.length } files containing a total of { commit.revisions.length } revisions.
            </div>
          </div>
        </SubSubHeader>
        <Container className={ classes.files }>
          <div className="text-mini-caps">Files updated:</div>
          { groupedRevisions.map((file, index) => (
            <FileCompare 
              className={ classes.file }
              project={ project } 
              file={ file } 
              type="collapse"
              isOpen={ index === 0 }
              key={ file._id }
            />
          ))}
        </Container>
      </div>
    )
  }
  render() {
    const { commit } = this.props
    return (
      <div className={ classes.content }>
        { commit && commit.data 
          ? this.renderLoaded()
          : null }
      </div>
    )
  }
}
