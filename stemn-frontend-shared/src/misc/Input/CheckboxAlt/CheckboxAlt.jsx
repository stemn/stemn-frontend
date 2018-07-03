import React from 'react'
import MdDone from 'react-icons/md/done'

// Styles
import classNames from 'classnames'
import classes from './CheckboxAlt.css'

/** ******************************

props: {
  tickOnly: true (default: false)   -> this will hide the bg color
}
******************************* */
export default class extends React.Component {
  render() {
    const { status, onChange } = this.props
    const id = Math.random().toString(36).substring(7)
    return (
      <div className={ classNames(classes.radio, { [classes.tickOnly]: this.props.tickOnly }) }>
        <label className="layout-row layout-align-start-center">
          <input type="checkbox" checked={ status } onChange={ onChange } />
          <div className="layout-row layout-align-start-center flex">
            <div className={ classNames('flex', this.props.className) }>{this.props.children}</div>
            <MdDone size="16" />
          </div>
        </label>
      </div>
    )
  }
}
