import React, { Component, PropTypes } from 'react'

import classes from './SettingsProfileDetails.css'

import UserExperienceSettings from 'stemn-shared/misc/UserSettings/UserExperienceSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'

// import Upload from 'stemn-shared/misc/Upload/Upload'

export default class SettingsProfileDetails extends Component {
  saveUser = () => {
    this.props.saveUser({
      user: this.props.user.data,
    })
  }
  render() {
    const { user, entityModel } = this.props
    return (
      <div>
        <div className="text-title-3">Experience</div>
        <br />
        <UserExperienceSettings
          data={ user.data.profile.profileDetails.experience }
          dataModel={ `${entityModel}.data.profile.profileDetails.experience` }
          type="experience"
        />
        <br />
        <br />
        <div className="text-title-3">Education</div>
        <br />
        <UserExperienceSettings
          data={ user.data.profile.profileDetails.education }
          dataModel={ `${entityModel}.data.profile.profileDetails.education` }
          type="education"
        />
      </div>
    )
  }
}
