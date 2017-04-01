import React, { Component, PropTypes } from 'react';
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill';
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer';
import StandardLayout from 'layout/StandardLayout';

class Project extends Component {
  renderComplete() {
    const { children, params, project } = this.props;
    return (
      <div>
        <h1>{ project.data.name }</h1>
        <div>
          { children }
        </div>
      </div>
    )
  }
  renderPending() {
    return (
      <div>Loading</div>
    )
  }
  render() {
    const { project } = this.props;
    return (
      <StandardLayout contained style={ { marginTop: '30px' } }>
        { project && project.data
          ? this.renderComplete()
          : this.renderPending()
        }
      </StandardLayout>
    )
  }
}

export default Project;