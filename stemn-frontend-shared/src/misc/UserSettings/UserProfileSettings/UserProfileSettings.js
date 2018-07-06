import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import classes from './UserProfileSettings.css'
import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Textarea from 'stemn-shared/misc/Input/Textarea'
import Upload from 'stemn-shared/misc/Upload/Upload'
import LocationSearch from 'stemn-shared/misc/Search/LocationSearch'

export default class UserProfileSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    userModel: PropTypes.string.isRequired,
    saveUser: PropTypes.func.isRequired,
  }
  render() {
    const { user, userModel, saveUser } = this.props
    return (
      <Row className="layout-xs-column layout-sm-column layout-gt-sm-row">
        <Col className="flex flex-order-sm-1 flex-order-xs-1">
          <h3>First and Last Name</h3>
          <div className="layout-row">
            <Input
              model={ `${userModel}.data.profile.firstname` }
              value={ user.data.profile.firstname }
              className="dr-input flex"
              type="text"
              placeholder="First Name"
              style={ { marginRight: '7px' } }
            />
            <Input
              model={ `${userModel}.data.profile.lastname` }
              value={ user.data.profile.lastname }
              className="dr-input flex"
              type="text"
              placeholder="Last Name"
              style={ { marginLeft: '7px' } }
            />
          </div>
          <br />
          <h3>Blurb</h3>
          <Textarea
            model={ `${userModel}.data.blurb` }
            value={ user.data.blurb }
            className="dr-input"
            type="text"
          />
          <br />
          <h3>Website</h3>
          <Input
            model={ `${userModel}.data.profile.socialLinks.website` }
            value={ user.data.profile.socialLinks.website }
            className="dr-input flex"
            type="text"
          />
          <br />
          <h3>Location</h3>
          <LocationSearch
            cacheKey={ user.data._id }
            model={ `${userModel}.data.profile.location[0]` }
            value={ user.data.profile.location[0] }
          />
          <br />
          <ProgressButton
            className="primary"
            loading={ user.savePending }
            onClick={ saveUser }
          >
            Save Profile
          </ProgressButton>
        </Col>
        <Col className={ cn(classes.avatarCol, 'flex-order-sm-0 flex-order-xs-0') }>
          <h3>Profile Picture</h3>
          <Upload
            containerClassName={ classes.container }
            imageClassName={ classes.avatar }
            model={ `${userModel}.data.profile.picture` }
            value={ user.data.profile.picture }
            uploadId="UserSettingsAvatar"
          />
        </Col>
      </Row>
    )
  }
}

