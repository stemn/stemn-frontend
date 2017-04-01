import React, { Component, PropTypes } from 'react';
import StandardLayout from 'layout/StandardLayout';
import Project from 'modules/Project'

class User extends Component {
  renderComplete() {
    const { user, projects } = this.props;
    return (
      <div>
        <h1>User: { user.data.name }</h1>
        <div>{ user.data.blurb }</div>
        { projects.data.map(project => (
          <Project key={ project._id } project={ project }/>
        ))}
      </div>
    )
  }
  renderPending() {
    return (
      <div>Loading</div>
    )
  }
  render() {
    const { user } = this.props;
    return (
      <StandardLayout contained>
        { user && user.data
          ? this.renderComplete()
          : this.renderPending()
        }
      </StandardLayout>
    )
  }
}

export default User;

