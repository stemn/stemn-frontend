/** ************************************************************
  <TogglePanel cacheKey="some-cache-id">
    <div className="layout-row flex layout-align-start-center">
      <div className="flex">Header Content</div>
    </div>
    <div>
      Panel Content
    </div>
  </TogglePanel>
************************************************************* */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { toggle } from './TogglePanel.actions.js'
import styles from './TogglePanel.css'
import MdChevronRight from 'react-icons/md/chevron-right'

export const TogglePanel = React.createClass({
  propTypes: {
    cacheKey: PropTypes.string.isRequired,  // Some cache key string (used as the key in the 'togglePanel' store)
  },
  toggle(toState) {
    this.props.dispatch(toggle({
      cacheKey: this.props.cacheKey,
      value: toState,
    }))
  },
  render() {
    const { toggleState, className } = this.props
    const getContent = () => {
      if (toggleState) {
        return (
          <div className={ styles.content }>
            {this.props.children[2]}
          </div>
        )
      }
    }
    return (
      <div>
        <div className={ classNames(styles.titleBar, 'layout-row layout-align-start-center', className) }>
          <MdChevronRight onClick={ () => this.toggle(null) } className={ classNames(styles.toggleIcon, { [styles.toggleIconActive]: toggleState }) } size="22" />
          <div className="flex layout-row layout-align-start-center">
            <div className="flex" onClick={ () => this.toggle(null) }>{this.props.children[0]}</div>
            {this.props.children[1]}
          </div>
        </div>
        {getContent()}
      </div>
    )
  },
})

const mapStateToProps = ({ togglePanel }, { cacheKey }) => ({
  toggleState: togglePanel[cacheKey],
})

export default connect(mapStateToProps)(TogglePanel)
