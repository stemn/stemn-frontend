import React, { Component } from 'react';

import classNames from 'classnames';
import classes from './ProjectCommit.css'

import { Container } from 'stemn-shared/misc/Layout';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
//import FileCompare from 'stemn-shared/misc/FileCompare/FileCompare.jsx';

export default class ProjectCommit extends Component {
  renderLoaded() {
    const { commit: { data: commit }, project } = this.props;

    return (
      <div>
        <div className={ classes.header }>
          <Container>
            <div className={ classes.headerBorder } />
            <h2 className={ classes.title }>
              <span>{ commit.data.summary }</span>
              <span className={ classes.commitNumber }>&nbsp;#234</span>
            </h2>
            <div className={ classes.blurb }>
              { commit.data.description }
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
              <div>&nbsp;commited 13 files.</div>
            </div>
          </Container>
        </div>
        <Container className={ classes.files }>
          { commit.data.items.map((commit) => (
            <div key={ commit._id }>{ commit.data.name }</div>
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
};

//          { item.data.items ?
//            groupedRevisions.map(file => <FileCompare project={project} file={file} type="collapse" key={file._id}/>)
//          : null}