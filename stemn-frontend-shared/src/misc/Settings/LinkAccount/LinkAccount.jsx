import React from 'react'

import Popover from 'stemn-shared/misc/Popover'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdDone from 'react-icons/md/done'
import MdLink from 'react-icons/md/link'
import MdMoreHoriz from 'react-icons/md/more-horiz'

import classes from './LinkAccount.css'

export default class LinkAccount extends React.Component {
  render() {
    return (
      <div className={ `${classes.row} layout-row layout-align-start-center` }>
        <div onClick={ () => { if (!this.props.isLinked) { this.props.linkFn() } } } className="flex layout-row layout-align-start-center">
          {this.props.isLinked ? <MdDone size="22" /> : <MdLink size="20" />}
          <div className="flex" style={ { marginLeft: '10px' } }>{this.props.isLinked ? <span>Connected with {this.props.text}</span> : <span>Connect to {this.props.text}</span>}</div>
        </div>
        {
          this.props.isLinked
            ?
              <Popover preferPlace="right">
              <SimpleIconButton>
                  <MdMoreHoriz size="20" />
                </SimpleIconButton>
              <div className="PopoverMenu">
                  <a onClick={ this.props.unLinkFn }>Unlink Account</a>
                  {this.props.email ? <a className="info">Email: {this.props.email}</a> : null}
                </div>
            </Popover>
            : ''
        }
      </div>
    )
  }
}
