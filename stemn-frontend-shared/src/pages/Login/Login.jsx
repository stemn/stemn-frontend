// Component Core
import React, { Component } from 'react'

// Styles
import cn from 'classnames'
import classes from './Login.css'

// Sub Components
import Input from 'stemn-shared/misc/Input/Input/Input'
import Link from 'stemn-shared/misc/Router/Link'
import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

export default class Login extends Component {
  submit = (event) => {
    event.preventDefault()
    this.props.login({
      email: this.props.auth.login.email,
      password: this.props.auth.login.password,
    })
  }
  render() {
    const { authenticate, auth } = this.props

    return (
      <div className="flex rel-box">
        <div className={ cn(classes.background, 'layout-column layout-align-center-center') }>
          <div className={ cn(classes.panel, 'layout-column', 'layout-align-space-between') }>
            <div className="text-title-3">Sign In</div>
            <form onSubmit={ this.submit }>
              <br />
              <Input
                model="auth.login.email"
                value={ auth.login.email }
                className="dr-input"
                type="text"
                placeholder="Email"
              />
              <Input
                model="auth.login.password"
                value={ auth.login.password }
                className="dr-input"
                type="password"
                placeholder="Password"
              />
              <div className="layout-row layout-align-start-center">
                <div className="flex-50" />
                <div className="flex-50 layout-row">
                  <Button
                    style={ { marginLeft: '5px', marginTop: '5px' } }
                    className="primary flex"
                    type="submit"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
              <div className={ classes.textDivider }><div>OR</div></div>
              <div className="layout-row">
                <Button
                  onClick={ () => authenticate('linkedin') }
                  style={ { marginRight: '5px' } }
                  className="flex linkedin"
                  type="button"
                >
                  Linkedin
                </Button>
                <Button
                  onClick={ () => authenticate('facebook') }
                  style={ { marginLeft: '5px' } }
                  className="flex facebook"
                  type="button"
                >
                  Facebook
                </Button>
              </div>
              <LoadingOverlay show={ auth.authLoading || auth.userLoading } />
            </form>
            <div className="layout-row text-title-5">
              <div className="layout-row flex">Dont have an account?&nbsp;<Link name="registerRoute" className="link-primary">Register</Link></div>
              <Link name="passwordLostRoute" className="link-primary">I forgot</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
