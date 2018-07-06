import React from 'react'

import MdChevronRight from 'react-icons/md/chevron-right'

// Styles
import classes from './TogglerExpand.css'
import cn from 'classnames'

export default class TogglerExpand extends React.Component {
  render() {
    const { children, onClick, isActive } = this.props
    return (
      <div className={ cn(classes.button, 'layout-row', 'layout-align-start-center', { [classes.buttonActive]: isActive }) } onClick={ onClick }>
        {children}
        <MdChevronRight size="18" />
      </div>
    )
  }
}
