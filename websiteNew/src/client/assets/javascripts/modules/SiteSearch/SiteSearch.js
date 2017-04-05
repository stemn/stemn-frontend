import React, { Component, PropTypes } from 'react';
import classes from './SiteSearch.css';
import classNames from 'classnames';
import MdSearch from 'react-icons/md/search';


import { projectRoute } from 'route-actions';

export default class SiteSearch extends Component {
  render() {
//    const { project, className } = this.props;
    
    return (
      <div className={ classNames('layout-row layout-align-start-center', classes.search) } >
        <input className='flex' placeholder='Search'/>
        <MdSearch className={ classes.icon } size={ 20 }/>
      </div>
    )
  }
}
