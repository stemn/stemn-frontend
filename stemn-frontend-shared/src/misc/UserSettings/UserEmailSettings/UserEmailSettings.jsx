import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Form from 'stemn-shared/misc/Forms/Form'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class UserEmailSettings extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    setPrimaryEmail: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
  }
  addEmail = () => {
    const {
      setPrimaryEmail,
      auth,
    } = this.props
    //    saveUser({
    //      user: {
    //        _id: auth.user._id,
    //        accounts: {
    //          local: {
    //            email: auth.forms.newEmail,
    //          }
    //        }
    //      }
    //    })
    setPrimaryEmail(auth.forms.newEmail)
  }
  render() {
    const { auth } = this.props
    const primary = auth.user.email

    return (
      <div>
        <h3>Set Primary Email</h3>
        <p>Your primary address is where your emails will be sent.</p>
        <Form model="auth.forms.newEmail" value={ primary }>
          { !(auth.forms.newEmail === undefined) &&
            <div className="rel-box">
              <Input
                placeholder="Email account"
                className="dr-input"
                model="auth.forms.newEmail"
                value={ auth.forms.newEmail }
              />
            </div>
          }
        </Form>
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
            loading={ auth.emailUpdatePending }
            className="primary"
            onClick={ this.addEmail }
          >
            Update Email
          </ProgressButton>
        </div>
      </div>
    )
  }
}
