import React, { Component, PropTypes } from 'react';

import classes from './User.css';
import classNames from 'classnames';

import StandardLayout from 'layout/StandardLayout';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import UserNavHeader from 'modules/UserNavHeader';

class User extends Component {
  renderComplete() {
    const { user, children, currentUser } = this.props;
    
    const isCurrentUser = user.data._id === currentUser._id;
    
    const baseUrl = `/users/${user.data._id}`
    return (
      <div>
        <UserNavHeader user={ user } currentUser={ currentUser }/>
        <Container>
          <Row className='layout-row'>
            <Col className={ classes.sidebar }>
              <UserAvatar 
                name={ user.data.name }
                shape='square'
                size={ 270 }
                className={ classes.avatar }
              />
              <div className={ classes.userPanel }>
                <h2 className={ classes.name }>{ user.data.name }</h2>
                <h3 className={ classes.blurb }>{ user.data.blurb }</h3>
              </div>
            </Col>
            <Col className='flex'>
              { children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  renderPending() {
    return (
      <div>Loading</div>
    )
  }
  render() {
    const { user, children } = this.props;
    
    const isLoaded = user && user.data;

    return (
      <StandardLayout>
        <LoadingOverlay show={ !isLoaded } hideBg/>
        { isLoaded
        ? this.renderComplete()
        : null }
      </StandardLayout>
    )
  }
}

export default User;
