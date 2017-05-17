// Container Core
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js';
import * as AuthActions from 'stemn-shared/misc/Auth/Auth.actions.js';

// Component
import Select from 'react-select';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

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
//      .then((response) => {
//        // TODO: NEED TO FIX THIS SHIT. TOO MUCH WINE TO UNDERSTAND HOW
//        this.props.dispatch(storeChange(this.props.model, selectedProvider.value));
//        console.log(response);
//      })
//      .catch((response) => {
//         console.log(response);
//      });
    }
    // Else, we update the model straight away
    else{
      this.props.dispatch(storeChange(this.props.model, selectedProvider.value));
    }
  },
  render(){
    const {model, value, dispatch, auth} = this.props

    var options = [
      {
        value: 'dropbox',
        label: 'Dropbox',
        authType: 'dropbox',
        isAuthed: (accounts) => accounts.dropbox && accounts.dropbox.id
      }, {
        value: 'drive',
        label: 'Drive',
        authType: 'google',
        isAuthed: (accounts) => accounts.google && accounts.google.refreshToken
      },{
        value: undefined,
        label: 'None',
        authType: '',
        isAuthed: (accounts) => true
      }
    ];

    return (
      <div className="rel-box">
        <LoadingOverlay show={auth.authLoading} linear={true} hideBg={true}/>
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
