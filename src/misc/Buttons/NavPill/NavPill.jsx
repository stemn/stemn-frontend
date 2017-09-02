import React from 'react'
import Link from 'stemn-shared/misc/Router/Link'

// Styles
import classNames from 'classnames'
import classes from './NavPill.css'

export default class extends React.Component {
  render() {
    return (
      <Link 
        className={ classNames(classes.button, this.props.className) }
        activeClassName="active"
        to={ this.props.to }
        onlyActiveOnIndex={ this.props.onlyActiveOnIndex }
        name={ this.props.name }
        params={ this.props.params }
      >
        {this.props.children}
      </Link>
    )
  }
}
