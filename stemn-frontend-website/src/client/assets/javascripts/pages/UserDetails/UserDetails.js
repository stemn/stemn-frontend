import React, { Component } from 'react'

import classes from './UserDetails.css'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'


class EducationItem extends Component {
  render() {
    const { item } = this.props
    
    const organisation = item.organisations[0] 
      ? item.organisations[0].name
      : item.school
    
    return (
      <div className={ classes.item }>
        <div className="layout-row layout-align-start-center">
          <div className="flex">
            <div className={ `${classes.main} text-mini-caps` }>
              <span>{ item.degree }</span>
              { item.degree && item.fieldOfStudy 
                ? <span className="text-interpunct" />
                : null }              
              <span>{ item.fieldOfStudy }</span>
            </div>
            <div className={ `${classes.sub} text-mini-caps` }>
              <span>{ organisation }</span>
              <span className="text-interpunct" />
              <span>{ item.startDate.year } - { item.isCurrent ? 'Current' : item.endDate.year }</span>
            </div>
          </div>
          { item.organisations[0]
            ? <Link name="organisationRoute" params={ { organisationId: item.organisations[0]._id } }>
              <UserAvatar 
                name={ item.organisations[0].name }
                picture={ item.organisations[0].picture }
                shape="square"
                display="contain"
                size={ 35 }
              />
            </Link>
            : null }
        </div>
        <p className={ classes.notes }>
          { item.notes }
        </p>
      </div>
    )
  }
}

class ExperienceItem extends Component {
  render() {
    const { item } = this.props
    const company = item.organisations[0] 
      ? item.organisations[0].name
      : item.company
    
    return (
      <div className={ classes.item }>
        <div className="layout-row layout-align-start-center">
          <div className="flex">
            <div className={ `${classes.main} text-mini-caps` }>
              <span>{ item.position }</span>
              { item.position && company 
                ? <span className="text-interpunct" />
                : null }
              <span>{ company }</span>
            </div>
            <div className={ `${classes.sub} text-mini-caps` }>
              <span>{ item.startDate.year } - { item.isCurrent ? 'Current' : item.endDate.year }</span>
            </div>
          </div>
          { item.organisations[0]
            ? <Link to="/">
              <UserAvatar 
                name={ item.organisations[0].name }
                picture={ item.organisations[0].picture }
                shape="square"
                display="contain"
                size={ 35 }
              />
            </Link>
            : null }
        </div>
        <p className={ classes.notes }>
          { item.notes }
        </p>
      </div>
    )
  }
}

export default class UserDetails extends Component {
  render() {
    const { user } = this.props
    const hasExperience = user.data.profile.profileDetails.experience && user.data.profile.profileDetails.experience.length > 0
    const hasEducation = user.data.profile.profileDetails.education && user.data.profile.profileDetails.education.length > 0
    const hasAbout = user.data.profile.profileDetails.summary.length > 0
    
    return (
      <div>
        { hasAbout && ( 
          <div>
            <div className="text-mini-caps">About</div>
            <br />
            <InfoPanel>
              <p className={ classes.summary }>{ user.data.profile.profileDetails.summary }</p>
            </InfoPanel>
            <br />
          </div>
        )}
        { hasEducation && (
          <div>
            <div className="text-mini-caps">Education</div>
            <br />
            <InfoPanel>
              { user.data.profile.profileDetails.education.map(item => (
                <EducationItem key={ item._id } item={ item } />
              ))}
            </InfoPanel>        
            <br />
          </div>
        )}
        { hasExperience && (
          <div>
            <div className="text-mini-caps">Experience</div>
            <br />
            <InfoPanel>
              { user.data.profile.profileDetails.experience.map(item => (
                <ExperienceItem key={ item._id } item={ item } />
              ))}
            </InfoPanel>
          </div>
        )}
        
        { !hasAbout && !hasExperience && !hasEducation && (
          <div className="text-title-5">
            { user.data.profile.firstname } has no profile details
          </div>
        )}

      </div>
    )
  }
}
