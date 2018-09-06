import React, { Component } from 'react'
import classes from './SiteSearch.css'
import cn from 'classnames'
import MdSearch from 'react-icons/md/search'
import { Link } from 'react-router'

import Input from 'stemn-shared/misc/Input/Input/Input'

export default class SiteSearch extends Component {
  render() {
    const { query, setQuery, push, className } = this.props
    const route = {
      pathname: '/search',
      query: {
        q: query,
      },
    }

    const onSubmit = (event) => {
      event.preventDefault()
      if (location.pathname.includes('search')) {
        
      } else {
        push(route)
      }
    }

    return (
      <form className={ cn('layout-row layout-align-start-center', classes.search, className) } name="siteSearch" onSubmit={ onSubmit }>
        <Input
          className="flex"
          placeholder="Search"
          value={ query }
          changeAction={ setQuery }
        />
        <Link to={ route }>
          <MdSearch className={ classes.icon } size={ 20 } />
        </Link>
      </form>
    )
  }
}
