import React, { Component } from 'react'

import UserExperienceSettings from 'stemn-shared/misc/UserSettings/UserExperienceSettings'

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
