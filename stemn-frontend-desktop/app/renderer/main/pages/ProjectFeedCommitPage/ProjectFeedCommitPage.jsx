import React, { Component } from 'react'
import classes from './ProjectFeedCommitPage.css'
import FileCompare from 'stemn-shared/misc/FileCompare'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import moment from 'moment'
import Link from 'stemn-shared/misc/Router/Link'
import { groupRevisions }  from 'stemn-shared/misc/Timeline/Timeline.utils.js'

export default class ProjectFeedPageCommit extends Component {
  render() {
    const { project, commit, toggleMulti } = this.props
    if (!commit) return null

    const groupedRevisions = groupRevisions(commit.data.items)
    const toggleMultiple = () => toggleMulti({
      cacheKeys: groupedRevisions.map(revision => `${revision.data.fileId}-${revision.data.revisionId}`),
    })
    const params = {
      projectId: commit.data.project._id,
      commitId: commit._id,
    }

    return (
      <div className="layout-column flex">
        <div className={ classes.commitInfo }>
          <h3 className={ classes.title }>{ commit.data.name }</h3>
          <div className={ classes.description }>
            <EditorDisplay value={ commit.data.body } />
          </div>
          <div className="layout-row layout-align-start-center">
            <UserAvatar
              picture={ commit.user.picture }
              name={ commit.user.name }
              size={ 20 }
            />
            <div style={ { marginLeft: '10px' } }>
              { commit.user.name }
              <span className="text-grey-3" style={ { marginLeft: '10px' } }>{ moment(commit.timestamp).format('LLLL') }</span>
            </div>
            <div className="flex" />
            <div className={ classes.links }>
              <Link className="link-primary" name="webCommitRoute" params={ params }>View Online</Link>
            </div>
          </div>
        </div>
        <div className="flex scroll-box">
          { commit.data.items ?
            groupedRevisions.map(file => (
              <FileCompare
                project={ project }
                file={ file }
                type="collapse"
                key={ file._id }
              />
            ))
            : null }
        </div>
      </div>
    )
  }
}
//              <a className="link-primary" onClick={ toggleMultiple }>Toggle All</a>
