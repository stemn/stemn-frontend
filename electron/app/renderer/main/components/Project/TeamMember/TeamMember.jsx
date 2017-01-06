import React from 'react';

// Components
import UserAvatar from 'electron/app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'
import PopoverMenu from 'electron/app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'electron/app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz';

// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render() {
    const {changePermissionsFn, removeTeamMemberFn, item} = this.props;

    const permissions = {
      admin : {
        value: 'admin',
        title: 'Administrator',
        icon: 'settings',
        description : 'Administrator: Can do everything',
        descriptionDetailed : 'Can add/remove users. Can change settings.'
      },
      collaborator : {
        value: 'collaborator',
        title: 'Collaborator',
        icon: 'edit',
        description : 'Collaborator: Can view and edit',
        descriptionDetailed : 'Can sync all files. Can view all revisions.'
      },
      viewer : {
        value: 'viewer',
        title: 'Viewer',
        icon: 'visibility',
        description : 'Viewer: Can view but can\'t edit',
        descriptionDetailed : 'Can comment and can view files.'
      }
    }

    return (
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={item.picture} size={40}/>
        <div className="flex" style={{marginLeft: '15px'}}>
          <div className="text-bold" style={{marginBottom: '5px'}}>{item.name}</div>
          <div className="text-description-1">{permissions[item.permissions.role].description}</div>
        </div>

        {!item.owner
          ?
          <PopoverMenu preferPlace="right">
            <SimpleIconButton>
              <MdMoreHoriz size="20px"/>
            </SimpleIconButton>
            <div className="PopoverMenu">
              <a className={classNames({'active': item.permissions.role == 'admin'})} onClick={()=>changePermissionsFn({userId: item._id, role: 'admin'})}>Set Permission: Admin</a>
              <a className={classNames({'active': item.permissions.role == 'collaborator'})} onClick={()=>changePermissionsFn({userId: item._id, role: 'collaborator'})}>Set Permission: Collaborator</a>
              <a className={classNames({'active': item.permissions.role == 'viewer'})} onClick={()=>changePermissionsFn({userId: item._id, role: 'viewer'})}>Set Permission: Viewer</a>
              <div className="divider"></div>
              <a onClick={()=>removeTeamMemberFn({userId: item._id})}>Remove User</a>
              </div>
          </PopoverMenu>
          :
          ''
        }
      </div>
    );
  }
};
