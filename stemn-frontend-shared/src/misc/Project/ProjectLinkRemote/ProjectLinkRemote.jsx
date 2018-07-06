import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authenticate } from 'stemn-shared/misc/Auth/Auth.actions.js'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

class ProjectLinkRemote extends Component {
  onChange = ({ isAuthed, authType, value }) => {
    const { model, storeChange, authenticate } = this.props
    // If the selected provider is not authed, auth it
    if (!isAuthed) {
      authenticate(authType)
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
    else {
      storeChange(model, value)
    }
  }
  render() {
    const {
      value,
      auth,
    } = this.props

    const options = [
      {
        value: 'dropbox',
        name: 'Dropbox',
        onClick: () => {
          const accounts = auth.user.accounts
          const isAuthed = accounts.dropbox && accounts.dropbox.id
          this.onChange({
            isAuthed,
            authType: 'dropbox',
            value: 'dropbox',
          })
        },
      }, {
        value: 'drive',
        name: 'Drive',
        onClick: () => {
          const accounts = auth.user.accounts
          const isAuthed = accounts.google && accounts.google.refreshToken
          this.onChange({
            isAuthed,
            authType: 'google',
            value: 'drive',
          })
        },
      }, {
        value: undefined,
        name: 'None',
        onClick: () => {
          this.onChange({
            isAuthed: true,
            value: undefined,
          })
        },
      },
    ]

    return (
      <PopoverDropdown
        value={ value }
        options={ options }
        style={ { width: '100%' } }
        className="input"
        loading={ auth.authLoading }
      />
    )
  }
}

const mapStateToProps = ({ auth }, {}) => ({
  auth,
})

const mapDispatchToProps = {
  authenticate,
  storeChange,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectLinkRemote)
