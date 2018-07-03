import React from 'react'

import UserAvatar from '../UserAvatar/UserAvatar.jsx'

export default class UserAvatars extends React.Component {
  render() {
    const { users, limit, shape, size, className } = this.props

    const moreStyles = {
      display: 'inline-block',
      margin: '0 2px',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      lineHeight: '25px',
      background: 'rgba(0, 0, 0, 0.1)',
      color: 'rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
      verticalAlign: 'top',
    }

    if (users && users.length > 0) {
      const usersToShow   = users.length > limit ? users.slice(0, limit - 1) : users
      const usersNotShown = users.length > limit ? users.slice(limit - 1, users.length) : []
      return (
        <div className={ className }>
          {usersToShow.map((user, index) =>
            <UserAvatar
              shape={ shape }
              title={ user.name }
              name={ user.name }
              style={ { margin: '0 2px' } }
              key={ user._id || index }
              picture={ user.picture }
              size={ size || 25 }
            />,
          )}
          { usersNotShown.length > 0
            ? <span style={ moreStyles } title={ `${usersNotShown.length} more users.` }>+{usersNotShown.length}</span>
            : null }
        </div>
      )
    }
    
    return null
  }
}
