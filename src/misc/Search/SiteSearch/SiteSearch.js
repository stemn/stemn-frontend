import React, { Component, PropTypes } from 'react'
import classes from './SiteSearch.css'
import classNames from 'classnames'
import MdSearch from 'react-icons/md/search'
import { Link } from 'react-router'

import Input from 'stemn-shared/misc/Input/Input/Input'

export default class SiteSearch extends Component {
  render() {
    const { query, setQuery, push } = this.props;
    const route = {
      pathname: '/search',
      query: {
        q: query
      }
    }

    const onSubmit = (event) => {
      event.preventDefault()
      if (location.pathname.includes('search')) {
        return
      } else {
        push(route)
      }
    }

    return (
      <form className={ classNames('layout-row layout-align-start-center', classes.search) }  ame="siteSearch" onSubmit={ onSubmit }>
        <Input
          className="flex"
          placeholder="Search"
          value={ query }
          changeAction={ setQuery }
        />
        <Link to={ route }>
          <MdSearch className={ classes.icon } size={ 20 }/>
        </Link>
      </form>
    )
  }
}
