import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { groupRevisions } from 'app/renderer/main/modules/Timeline/Timeline.utils.js'

import TogglerExpand from 'app/renderer/main/components/Toggler/TogglerExpand/TogglerExpand.jsx';

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
      const groupedRevisions = groupRevisions(this.props.item.data.items);
      const getChildRows = () => {
        if(this.state.isOpen){
          return groupedRevisions.map((file)=>{
            return (
            <div key={file._id}
              className={classNames(styles.timelineRow, styles.inner, 'layout-row', {[styles.active]: this.props.isActive})}
              onClick={this.props.clickFn}>
              <div className="flex">{file.data.path}</div>
              <div>{file.revisions.length} revisions</div>
            </div>
            )
          })
        }
      }
      return (
        <div>
          <div className={classNames('layout-row', 'layout-align-start-center', styles.timelineRow, {[styles.active]: this.props.isActive})}>
            <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={this.props.clickFn}>
              <img style={{width: '40px', height: '40px'}} src={'https://stemn.com' + this.props.item.user.picture + '?size=thumb&crop=true'} />
              <div className={styles.text + ' flex text-ellipsis'}>
                <b>{this.props.item.data.summary}</b>
                <div style={{marginTop: '5px'}}>{timeFromNow} by {this.props.item.user.name}</div>
              </div>
            </div>
            <TogglerExpand isActive={this.state.isOpen} onClick={()=>this.toggle(null)}>
              {groupedRevisions.length}
            </TogglerExpand>
          </div>
          {getChildRows()}
        </div>
      )
    }
    else{
      return (
        <div className={classNames('layout-row', 'layout-align-start-center', styles.timelineRow, {[styles.active]: this.props.isActive})}>
          <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={this.props.clickFn}>
            <img style={{width: '40px', height: '40px'}} src={'https://stemn.com' + this.props.item.user.picture + '?size=thumb&crop=true'} />
            <div className={styles.text + ' flex text-ellipsis'}>
              <b>{this.props.item.data.path}</b>
              <div style={{marginTop: '5px'}}>{timeFromNow} by {this.props.item.user.name}</div>
            </div>
          </div>
        </div>
      )
    }
  }
})
