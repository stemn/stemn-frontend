import React from 'react'
import cn from 'classnames'
import classes from '../Login/Login.css'
import { Link } from 'react-router'
import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx'
import Input from 'stemn-shared/misc/Input/Input/Input'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

export default class Register extends React.Component {
  submit = (event) => {
    event.preventDefault()
    this.props.register({
      email: this.props.auth.login.email,
      password: this.props.auth.login.password,
      firstname: this.props.auth.login.firstname,
      lastname: this.props.auth.login.lastname,
    })
  };

  render() {
    const { authenticate, auth } = this.props
    
    return (
      <div className="flex rel-box">
        <div className={ cn(classes.background, 'layout-column layout-align-center-center') }>
          <div className={ cn(classes.panel, 'layout-column', 'layout-align-space-between') }>
            <div className="text-title-3">Register</div>
            <form onSubmit={ this.submit }>
              <br />
              <div className="layout-row">
                <Input
                  model="auth.login.firstname"
                  value={ auth.login.firstname }
                  className="dr-input"
                  style={ { marginRight: '5px' } }
                  type="text" placeholder="First name"
                />
                <Input
                  model="auth.login.lastname"
                  value={ auth.login.lastname }
                  className="dr-input"
                  style={ { marginLeft: '5px' } }
                  type="text" placeholder="Last name"
                />
              </div>
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
              <div className="layout-row layout-align-end">
                <div className="flex-50 layout-row">
                  <Button
                    style={ { marginLeft: '5px' } }
                    className="primary flex"
                    type="submit"
                  >
                    Register
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
              <div>Already have an account? <Link to="/login" className="link-primary">Login</Link></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

