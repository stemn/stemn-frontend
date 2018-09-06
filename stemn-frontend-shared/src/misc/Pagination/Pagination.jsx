import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './Pagination.css'
import MdChevronRight from 'react-icons/md/chevron-right'
import MdChevronLeft from 'react-icons/md/chevron-left'
import { Link } from 'react-router'


export default class Pagination extends Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    noMoreResults: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    query: PropTypes.object, // query params to be extended
  }

  static defaultProps = {
    page: 1,
    noMoreResults: false,
  }

  render() {
    const { noMoreResults, page, query, path } = this.props

    const routePrev = {
      pathname: path,
      query: Object.assign({}, query, { page: parseInt(page) - 1 }),
    }
    const nextRoute = {
      pathname: path,
      query: Object.assign({}, query, { page: parseInt(page) + 1 }),
    }

    return (
      <div className="layout-row layout-align-end-center">
        { page > 1
          ? <Link to={ routePrev } className={ `${classes.button} layout-column layout-align-center-center` }>
            <MdChevronLeft size={ 20 } />
          </Link>
          : null }
        <div className={ `${classes.indicator} layout-column layout-align-center-center` }>
          Page: { page }
        </div>
        { !noMoreResults
          ? <Link to={ nextRoute } className={ `${classes.button} layout-column layout-align-center-center` }>
            <MdChevronRight size={ 20 } />
          </Link>
          : null }
      </div>
    )
  }
}
