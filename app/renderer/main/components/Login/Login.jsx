import React from 'react';
import {Form , Field } from 'react-redux-form';

// Components
import IconButton from '../Buttons/IconButton';
import {MdLockOpen} from 'react-icons/lib/md';

// Styles
import styles from './Login.css';

export default class LoginPage extends React.Component {
  render() {
    return (
      <div className="layout-column layout-align-center-center flex">
        <Form className={styles.form} model="login.model" onSubmit={this.props.loginUser}>
          <h3>Login Form</h3>
          <Field model="login.model.email">
            <input className={styles.input} type="text" placeholder="Email"/>
          </Field>

          <Field model="login.model.password">
            <input className={styles.input} type="password" placeholder="Password"/>
          </Field>

          <div className="layout-row layout-align-center"><IconButton type="submit"><MdLockOpen size="22"/>Login</IconButton></div>
        </Form >
      </div>
    );
  }
}
