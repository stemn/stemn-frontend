import React, { Component, PropTypes } from 'react'

import classes from './SettingsProfile.css'

import UserNameSettings from 'stemn-shared/misc/UserSettings/UserNameSettings'
import UserEmailSettings from 'stemn-shared/misc/UserSettings/UserEmailSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'

//import Upload from 'stemn-shared/misc/Upload/Upload'

export default class SettingsProfile extends Component {
  saveUser = () => {
    this.props.saveUser({
      user: this.props.user.data,
    })
  }
  render() {
    const { user, entityModel } = this.props
    return (
      <div>
        <InfoPanel>
          <Row className='layout-row'>
            <Col className='flex'>
              <h3>First and Last Name</h3>
              <div className="layout-row">
                <Input
                  model={`${entityModel}.data.profile.firstname`}
                  value={user.data.profile.firstname}
                  className="dr-input flex"
                  type="text"
                  placeholder="First Name"
                  style={{marginRight: '7px'}}
                />
                <Input
                  model={`${entityModel}.data.profile.lastname`}
                  value={user.data.profile.lastname}
                  className="dr-input flex"
                  type="text"
                  placeholder="Last Name"
                  style={{marginLeft: '7px'}}
                />
              </div>
              <br />
              <br />
              <h3>Blurb</h3>
              <Textarea
                model={`${entityModel}.data.profile.blurb`}
                value={user.data.profile.blurb}
                className="dr-input"
                type="text"
                placeholder="Profile blurb"
              />
              <br />
              <ProgressButton
                className="primary"
                loading={ user.savePending }
                onClick={ saveUser }>
                Save Profile
              </ProgressButton>
            </Col>
            <Col className={ classes.avatarCol }>
              <h3>Profile Picture</h3>
              <UserAvatar
                name={ user.data.name }
                picture={ user.data.picture }
                shape='square'
                size={ 220 }
                className={ classes.avatar }
              />
            </Col>
          </Row>
        </InfoPanel>
        <InfoPanel>
          <h3>Detailed Summary</h3>
          <Textarea
            model={`${entityModel}.data.profile.profileDetails.summary`}
            value={user.data.profile.profileDetails.summary}
            className="dr-input"
            type="text"
            placeholder="Detailed summary"
          />
          <br />
          <ProgressButton
            className="primary"
            loading={user.savePending}
            onClick={this.saveUser}>
            Save Profile
          </ProgressButton>
        </InfoPanel>
      </div>
    )
  }
}


//              <Upload
//                square={ true }
//                model={ `${entityModel}.data.profile.picture` }
//                value={ user.data.profile.picture }
//                uploadId='user-avatar'
//              />
