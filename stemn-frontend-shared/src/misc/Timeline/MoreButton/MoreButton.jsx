import React from 'react'

// Styles
import cn from 'classnames'
import classes from './MoreButton.css'

import MdChevronRight from 'react-icons/md/chevron-right'


export default class MoreButtons extends React.Component {
  render() {
    return (
      <a
        title={ this.props.title }
        onClick={ this.props.onClick }
        className={ cn(classes.moreButton, { [classes.moreButtonRight]: this.props.side === 'right' }, { [classes.moreButtonLeft]: this.props.side === 'left' }) }
      >
        <MdChevronRight size="15" />
      </a>
    )
  }
}
