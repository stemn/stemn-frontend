// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as AuthActions from 'stemn-shared/misc/Auth/Auth.actions.js'

// Component Core
import React from 'react'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

class Component extends React.Component {
  render() {
    const {
      owner, auth, authActions,
      modalCancel, modalConfirm,
    } = this.props

    const isCurrentUser = owner._id === auth.user._id

    return (
      <div style={ { width: '500px' } }>
        <div className="modal-title">Access to Google Drive has been revoked</div>
        <div className="modal-body" style={ { lineHeight: '1.4em' } }>
          { isCurrentUser
            ? <div>
              <p>Stemn's access to your Google Drive has been revoked. To fix this, please re-authenticate with Google.</p>
            </div>
            : <div>
              <p>This project is connected to <b>{owner.name}'s</b> Google Drive.</p>
              <p>Access to this drive has been revoked. {owner.name.split(' ')[0]} must re-authenticate with Drive for Stemn to work properly. Please contact them and instruct them to re-connect their Stemn account to Google.</p>
            </div>
          }
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button onClick={ modalCancel }>Cancel</Button>
          { isCurrentUser
            ? <Button
              style={ { marginLeft: '10px' } }
              className="primary"
              onClick={ () => { authActions.authenticate('google'); modalConfirm() } }
            >
              Authenticate
            </Button>
            : null }
        </div>
      </div>
    )
  }
}

// //////////////////////////////////////////////////////////////

function mapStateToProps({ auth }) {
  return {
    auth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
