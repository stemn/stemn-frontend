import React, { Component, PropTypes } from 'react'

import classes from './SettingsProfile.css'
import classNames from 'classnames'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Upload from 'stemn-shared/misc/Upload/Upload'
import LocationSearch from 'stemn-shared/misc/Search/LocationSearch'

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
          <Row className="layout-xs-column layout-sm-column layout-gt-sm-row">
            <Col className="flex flex-order-sm-1 flex-order-xs-1">
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
              <h3>Blurb</h3>
              <Textarea
                model={`${entityModel}.data.profile.blurb`}
                value={user.data.profile.blurb}
                className="dr-input"
                type="text"
              />
              <br />
              <h3>Website</h3>
              <Input
                model={`${entityModel}.data.profile.socialLinks.website`}
                value={user.data.profile.socialLinks.website}
                className="dr-input flex"
                type="text"
              />
              <br />
              <h3>Location</h3>
              <LocationSearch
                cacheKey={ user.data._id }
                model={ `${entityModel}.data.profile.location[0]` }
                value={ user.data.profile.location[0] }
              />
              <br />
              <ProgressButton
                className="primary"
                loading={ user.savePending }
                onClick={ this.saveUser }>
                Save Profile
              </ProgressButton>
            </Col>
            <Col className={ classNames(classes.avatarCol, 'flex-order-sm-0 flex-order-xs-0' ) }>
              <h3>Profile Picture</h3>
              <Upload
                containerClassName={ classes.container }
                imageClassName={ classes.avatar }
                model={ `${entityModel}.data.profile.picture` }
                value={ user.data.profile.picture }
                uploadId="UserSettingsAvatar"
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

