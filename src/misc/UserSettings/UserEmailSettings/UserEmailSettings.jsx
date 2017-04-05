import React, { Component, PropTypes } from 'react';

import Input from 'stemn-shared/misc/Input/Input/Input';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';

export default class UserEmailSettings extends Component {
//  static propTypes = {
//    updateUsername: PropTypes.func.isRequired,
//    username: PropTypes.string.isRequired,
//  }
  render() {
    const { updateUsername, username, project, entityModel } = this.props;
    return (
      <div>
        <h3>Change Email</h3>
        <p>Some description</p>
        <Input
          model={`${entityModel}.username`}
          className="dr-input"
          type="text"
          placeholder="Email"
        />
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton 
            className="primary"
            onClick={ updateUsername }>
            Update email
          </ProgressButton>
        </div>
      </div>
    )
  }
}

//           value={ project.data.name }
