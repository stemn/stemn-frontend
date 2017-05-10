import React, { Component, PropTypes } from 'react'
import { compact } from 'lodash'

import Input from 'stemn-shared/misc/Input/Input/Input'
import Form from 'stemn-shared/misc/Forms/Form'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'

import Drive from 'stemn-shared/assets/icons/providers/drive'
import Dropbox from 'stemn-shared/assets/icons/providers/dropbox'
import Facebook from 'stemn-shared/assets/icons/providers/facebook'
import Linkedin from 'stemn-shared/assets/icons/providers/linkedin'
import classes from './UserEmailSettings.scss'


class EmailRow extends Component {
  render () {
    const { primary, type, email, setPrimary } = this.props
    const getIcon = () => {
      if (type === 'google') {
        return Drive
      } else if (type === 'dropbox') {
        return Dropbox
      } else if (type === 'facebook') {
        return Facebook
      } else {
        return Linkedin
      }
    }

    const Icon = getIcon()

    if (email && email.length > 0) {
      return (
        <TextDisplayBox style={ { marginBottom: '10px' } }>
          { email }
          <div className="flex" />
          { type != 'local' &&
            <Icon size={ 16 } style={ { marginRight: '10px', color: 'rgba(0, 0, 0, 0.3)' } } /> }
          { email === primary
          ? <Button className="primary xs">Primary</Button>
          : <Button className="light xs" onClick={ () => setPrimary(email) }>Make Primary</Button> }
        </TextDisplayBox>
      )
    }
    return null
  }
}

export default class UserEmailSettings extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    setPrimaryEmail: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
  }
  addEmail = () => {
    const { saveUser, auth } = this.props
    saveUser({
      user: {
        _id: auth.user._id,
        accounts: {
          local: {
            email: auth.forms.newEmail,
          }
        }
      }
    })
  }
  render () {
    const { auth, setPrimaryEmail } = this.props
    const accountTypes = Object.keys(auth.user.accounts)
    return (
      <div>
        <h3>Set Primary Email</h3>
        <p>Your primary address is where your emails will be sent.</p>
        <EmailRow setPrimary={ setPrimaryEmail } type="dropbox" primary={ auth.user.email } email={ auth.user.accounts.dropbox.email } />
        <EmailRow setPrimary={ setPrimaryEmail } type="google" primary={ auth.user.email } email={ auth.user.accounts.google.email } />
        <EmailRow setPrimary={ setPrimaryEmail } type="linkedin" primary={ auth.user.email } email={ auth.user.accounts.linkedin.email } />
        <EmailRow setPrimary={ setPrimaryEmail } type="facebook" primary={ auth.user.email } email={ auth.user.accounts.facebook.email } />
        <EmailRow setPrimary={ setPrimaryEmail } type="local" primary={ auth.user.email } email={ auth.user.accounts.local.email } />
        <br />
        <h3>Update email</h3>
        <Form model="auth.forms.newEmail" value={ auth.user.accounts.local.email }>
          { !(auth.forms.newEmail === undefined) &&
            <Input
              placeholder="Email account"
              className="dr-input"
              model="auth.forms.newEmail"
              value={ auth.forms.newEmail }
            />
          }
        </Form>
        <br />
        <div className='layout-row layout-align-end'>
          <ProgressButton
            className='primary'
            onClick={ this.addEmail }>
            Update Email
          </ProgressButton>
        </div>
      </div>
    )
  }
}
