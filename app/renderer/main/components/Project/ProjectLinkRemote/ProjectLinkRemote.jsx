// Container Core
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as AuthActions from 'app/shared/modules/Auth/Auth.actions.js';

// Component
import Select from 'react-select';
import selectCss from 'app/renderer/assets/css/select.css';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const Component = React.createClass({
  onChangeFn(selectedProvider){
    // If the selected provider is not authed, auth it
    if(!selectedProvider.isAuthed(this.props.auth.user.accounts)){
      this.props.AuthActions.authenticate(selectedProvider.authType)
      .then((response) => {
        this.props.dispatch(actions.change(this.props.model, selectedProvider.value));
        console.log(response);
      })
      .catch((response) => {
         console.log(response);
      });
    }
    // Else, we update the model straight away
    else{
      this.props.dispatch(actions.change(this.props.model, selectedProvider.value));
    }
  },
  render(){
    const {model, value, dispatch} = this.props

    var options = [
      {
        value: 'dropbox',
        label: 'Dropbox',
        authType: 'dropbox',
        isAuthed: (accounts) => accounts.dropbox.id
      }, {
        value: 'drive',
        label: 'Drive',
        authType: 'google',
        isAuthed: (accounts) => accounts.google.refreshToken
      },{
        value: undefined,
        label: 'None',
        authType: '',
        isAuthed: (accounts) => true
      }
    ];

    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          options={options}
          onChange={this.onChangeFn}
          clearable={false}
        />
      </div>
    );
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({auth}, {}) {
  return {
    auth
  };
}


function mapDispatchToProps(dispatch) {
  return {
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    AuthActions: bindActionCreators(AuthActions, dispatch),
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
