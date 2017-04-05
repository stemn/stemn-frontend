import React, { Component, PropTypes } from 'react';

import classes from './UserNavHeader.css';
import classNames from 'classnames';

import { Container } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs';
import { Link } from 'react-router';

export default class UserNavHeader extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  render() {
    const { user } = this.props;
    
    const isCurrentUser = user && user.data;
    const baseUrl = `/users/${user.data._id}`

    return (
      <div className={ classes.header }>
        <Container className={classNames(classes.headerInner, 'layout-row layout-align-start-center')}>
          <h1 className={ classes.title }>
            { user.data.name }
          </h1>
          <div className='flex'></div>
          <Tabs noline className={ classes.tabs }>
            <Link activeClassName='active' to={`${baseUrl}`} onlyActiveOnIndex>Overview</Link>
            <Link activeClassName='active' to={`${baseUrl}/projects`}>Projects</Link>
            <Link activeClassName='active' to={`${baseUrl}/stars`}>Stars</Link>
            <Link activeClassName='active' to={`${baseUrl}/followers`}>Followers</Link>
            <Link activeClassName='active' to={`${baseUrl}/following`}>Following</Link>
            { isCurrentUser
            ? <Link activeClassName='active' to={`/settings`}>Settings</Link> 
            : null }
          </Tabs>
        </Container>
      </div>
    )
  }
}