/**************************************************************
  <TogglePanel>
    <div className="layout-row flex layout-align-start-center">
      <div className="flex">Header Content</div>
    </div>
    <div>
      Panel Content
    </div>
  </TogglePanel>
**************************************************************/

import React from 'react';

import classNames from 'classnames';
import styles from './TogglePanel.css'

import {MdChevronRight} from 'react-icons/lib/md';

export default React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const getContent = () => {
      if(this.state.isOpen){
        return (
          <div className={styles.content}>
            {this.props.children[2]}
          </div>
        )
      }
    }
    return (
      <div>
        <div className={styles.titleBar + ' layout-row layout-align-start-center'}>
          <MdChevronRight onClick={()=>this.toggle(null)} className={classNames(styles.toggleIcon, {[styles.toggleIconActive] : this.state.isOpen})} size='22'></MdChevronRight>
          <div className="flex layout-row layout-align-start-center">
            <div className="flex" onClick={()=>this.toggle(null)}>{this.props.children[0]}</div>
            {this.props.children[1]}
          </div>
        </div>
        {getContent()}
      </div>
    );
  }
})
