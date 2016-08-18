import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import {MdChevronRight} from 'react-icons/lib/md';

// Styles
import styles from './SidebarTimelineRow.css';

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
    const timeFromNow = moment(this.props.item.timestamp).fromNow();

    if(this.props.item.event == 'commit'){
      const getChildRows = () => {
        if(this.state.isOpen){
          return this.props.item.data.items.map((file)=>{
            return <div key={file._id} className={classNames(styles.timelineRow, styles.inner, {[styles.active]: this.props.isActive})} onClick={this.props.clickFn}>{file.data.name}</div>
          })
        }
      }
      return (
        <div>
          <div className={classNames('layout-row', 'layout-align-start-center', styles.timelineRow, {[styles.active]: this.props.isActive})}>
            <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={this.props.clickFn}>
              <img src={'https://stemn.com' + this.props.item.user.picture + '?size=thumb&crop=true'} />
              <div className={styles.text + ' flex'}>
                <b>{this.props.item.data.summary}</b>
                <div>{timeFromNow} by {this.props.item.user.name}</div>
              </div>
            </div>
            <div className={classNames(styles.button, 'layout-row', 'layout-align-start-center', {[styles.buttonActive]: this.state.isOpen})} onClick={()=>this.toggle(null)}>
              {this.props.item.data.items.length}
              <MdChevronRight size="18" />
            </div>
          </div>
          {getChildRows()}
        </div>
      )
    }
    else{
      return (
        <div className={classNames('layout-row', 'layout-align-start-center', styles.timelineRow, {[styles.active]: this.props.isActive})}>
          <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={this.props.clickFn}>
            <img src={'https://stemn.com' + this.props.item.user.picture + '?size=thumb&crop=true'} />
            <div className={styles.text + ' flex'}>
              <b>{this.props.item.data.name}</b>
              <div>{timeFromNow} by {this.props.item.user.name}</div>
            </div>
          </div>
        </div>
      )
    }
  }
})
