import React, { Component, PropTypes } from 'react';
import classes from './Header.css';
import classNames from 'classnames';

import { Container, Row, Col } from 'stemn-shared/misc/Layout';
import Avatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import PopoverWrapper from 'react-popover-wrapper';
import { Link } from 'react-router';
import logo from 'images/logo80x80.png'

class Header extends Component {
  render() {
    const { auth, logout } = this.props;
    return (
      <header className={ classNames(classes.header, 'layout-row', 'layout-align-start-center') }>
        <Container className='layout-row layout-align-start-center'>
          <Link to='/' className={ classes.logo }>
            <img src={logo} alt=""/>
          </Link>
          <div className="flex"></div>
          <PopoverWrapper 
            offset={8}
            preferPlace='below' 
            trigger='click'>
            <div>
              <Avatar 
                shape='square'
                size={ 30 }
                name={ auth.user.name }
                picture={ auth.user.picture }
              />
            </div>
            <div className="PopoverMenu">
              <Link to={`/users/${auth.user._id}`}>Your profile</Link>
              <a>Your stars</a>
              <Link to='/settings'>Settings</Link>
              <div className="divider" />
              <a onClick={ logout }>Logout</a>
            </div>
          </PopoverWrapper>
        </Container>
      </header>
    )
  }
}

export default Header;