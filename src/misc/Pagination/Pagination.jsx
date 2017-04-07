import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import classes from './Pagination.css';

import MdChevronRight from 'react-icons/md/chevron-right';
import MdChevronLeft from 'react-icons/md/chevron-left';
import { Link } from 'react-router'


export default class Pagination extends Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    noMoreResults: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }

  static defaultProps = {
    page: 1,
    noMoreResults: false,
  }

  render() {
    const { noMoreResults, page, path } = this.props;
    return (
      <div className='layout-row layout-align-end-center'>
        { page > 1
        ? <Link to={`${ path }?page=${ parseInt(page) - 1 }`} className={ classes.button + ' layout-column layout-align-center-center'}>
            <MdChevronLeft size={ 20 } />
          </Link>
        : null }
        { !noMoreResults
        ? <Link to={`${ path }?page=${ parseInt(page) + 1 }`} className={ classes.button + ' layout-column layout-align-center-center'}>
            <MdChevronRight size={ 20 } />
          </Link>
        : null }
      </div>
    )
  }
}
