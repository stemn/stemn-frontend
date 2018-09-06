import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './UserSearch.css'

import Autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.container'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'

export default class UserSearch extends Component {
  static propTypes = {
    select: PropTypes.func.isRequired,
    cacheKey: PropTypes.string.isRequired,
  }
    
  renderResult = (suggestion, { query }) => (
    <div className="layout-row layout-align-start-center">
      <UserAvatar picture={ suggestion.picture } size={ 40 } name={ suggestion.name } />
      <div style={ { marginLeft: '10px' } } className="flex">
        <Highlight text={ suggestion.name } query={ query } hightlightClass={ classes.highlight } />
      </div>
    </div>
  )

  render() {
    const { select, cacheKey } = this.props
    
    return (
      <Autosuggest
        cacheKey={ `user-search-${cacheKey}` }
        placeholder="Search for team member"
        clickResult={ select }
        renderResult={ this.renderResult }
        entityType="user"
      />
    )
  }
}
