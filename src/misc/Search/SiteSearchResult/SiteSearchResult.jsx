import React, { Component, PropTypes } from 'react'
import classes from './SiteSearchResult.css'
import classNames from 'classnames';
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'

export default class SiteSearchResult extends Component {
  render() {
    const { result, query } = this.props

    return (
      <div className={ classNames('layout-row layout-align-start-center', classes.result) } >
        <UserAvatar
          size={ 40 }
          shape="square"
          name={ result.name }
          picture={ result.picture }
          className={ classes.avatar }
        />
        <div className="flex">
          <Link className="link-primary">
            <Highlight
              className="text-ellipsis"
              text={ result.name }
              query={ query }
              hightlightClass={ classes.highlight }
            />
          </Link>
          <div className={ classes.blurb + ' text-ellipsis'}>{ result.blurb }</div>
        </div>
      </div>
    )
  }
}
