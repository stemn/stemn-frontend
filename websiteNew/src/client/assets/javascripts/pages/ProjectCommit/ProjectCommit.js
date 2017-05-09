import React, { Component } from 'react';

import classNames from 'classnames';
import classes from './ProjectCommit.css'

import { groupRevisions }  from 'stemn-shared/misc/Timeline/Timeline.utils.js'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { Container } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import FileCompare from 'stemn-shared/misc/FileCompare'
import SubSubHeader from 'modules/SubSubHeader'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'

export default class ProjectCommit extends Component {
  renderLoaded() {
    const { commit: { data: commit }, project } = this.props;
    
    const groupedRevisions = groupRevisions(commit.data.items);

    return (
      <div>
        <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectCommitsRoute" params={ { projectId: project.data._id } } text="History" />
            <Crumb name="projectCommitsRoute" params={ { projectId: project.data._id } } query={ { type: 'commits' } } text="Commits" />
            <Crumb text={ commit.data.summary } />
          </Breadcrumbs>
          <br />
          <h2 className={ classes.title }>
            <span>{ commit.data.summary }</span>
            <span className={ classes.number }>&nbsp;#C{ commit.data.commitNumber }</span>
          </h2>
          <div className={ classes.blurb }>
            <EditorDisplay value={ commit.data.description } />
          </div>
          <div className={ classNames('layout-row layout-align-start-center', classes.meta)}>
            <UserAvatar
              className={ classes.avatar }
              name={ commit.user.name }
              picture={ commit.user.picture }
              size={ 20 }
              shape='square'
            />
            <b>{ commit.user.name }</b>
            <div>&nbsp;commited { groupedRevisions.length } files containing a total of { commit.data.items.length } revisions.</div>
          </div>
        </SubSubHeader>
        <Container className={ classes.files }>
          <div className='text-mini-caps'>Files updated:</div>
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
    );
  }
  render() {
    const { commit } = this.props;
    return (
      <div className={ classes.content }>
        { commit && commit.data 
        ? this.renderLoaded()
        : null }
      </div>
    )
  }
}
