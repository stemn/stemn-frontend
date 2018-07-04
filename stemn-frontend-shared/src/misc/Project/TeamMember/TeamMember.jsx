import React from 'react'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Popover from 'stemn-shared/misc/Popover'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'

import { get } from 'lodash'

import cn from 'classnames'

export default class TeamMember extends React.Component {
  render() {
    const { changePermissionsFn, removeTeamMemberFn, item } = this.props

    const permissions = {
      admin: {
        value: 'admin',
        title: 'Administrator',
        icon: 'settings',
        description: 'Administrator: Can do everything',
        descriptionDetailed: 'Can add/remove users. Can change settings.',
      },
      collaborator: {
        value: 'collaborator',
        title: 'Collaborator',
        icon: 'edit',
        description: 'Collaborator: Can view and edit',
        descriptionDetailed: 'Can sync all files. Can view all revisions.',
      },
      viewer: {
        value: 'viewer',
        title: 'Viewer',
        icon: 'visibility',
        description: 'Viewer: Can view but can\'t edit',
        descriptionDetailed: 'Can comment and can view files.',
      },
    }

    const getPermissions = role => permissions[role] || permissions.viewer

    const role = get(item, 'permissions.role')

    return (
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={ item.picture } size={ 40 } />
        <div className="flex" style={ { marginLeft: '15px' } }>
          <div className="text-bold" style={ { marginBottom: '5px' } }>{item.name}</div>
          <div className="text-description-1">{ getPermissions(role).description }</div>
        </div>

        {!item.owner
          ?
          <Popover preferPlace="right">
              <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
              <div className="PopoverMenu">
              <a className={ cn({ active: role === 'admin' }) } onClick={ () => changePermissionsFn({ userId: item._id, role: 'admin' }) }>Set Permission: Admin</a>
              <a className={ cn({ active: role === 'collaborator' }) } onClick={ () => changePermissionsFn({ userId: item._id, role: 'collaborator' }) }>Set Permission: Collaborator</a>
              <a className={ cn({ active: role === 'viewer' }) } onClick={ () => changePermissionsFn({ userId: item._id, role: 'viewer' }) }>Set Permission: Viewer</a>
              <div className="divider" />
              <a onClick={ () => removeTeamMemberFn({ userId: item._id }) }>Remove User</a>
            </div>
            </Popover>
          :
          ''
        }
      </div>
    )
  }
}
