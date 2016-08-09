import React from 'react';

import PreviewCode from './PreviewCode/PreviewCode'
// Styles
import classNames from 'classnames';

export default class extends React.Component{
  componentDidMount() {
//    this.props.sidebarActions.getProjects(this.props.auth.user._id);
  }
  render() {
    return (
      <div>
        <PreviewCode />
      </div>
    );
  }
};
