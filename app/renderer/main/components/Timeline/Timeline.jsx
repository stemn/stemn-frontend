import React from 'react';
import moment from 'moment';
import Popover from '../../../assets/other/react-popup';

import * as stringConcat from 'app/shared/helpers/stringConcat';

// Styles
import styles from './Timeline.css';
import classNames from 'classnames';


const PopupContent = (item) =>{
  const timeFromNow = moment(item.timestamp).fromNow();

  return (
    <div className={styles.popup + ' layout-row layout-align-start-center'}>
      <img className={styles.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />
      <div className="flex">
        <b>{stringConcat.end(item.data.summary, 30)}</b>
        <div>{timeFromNow} by {item.user.name}</div>
      </div>
    </div>
    )
}

const PopupTrigger = React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const PopupTriggerStyles = {
      width: '100%',
      height: '100%'
    }
    return (
      <Popover
        isOpen={this.state.isOpen}
        body={PopupContent(this.props.item)}
        preferPlace = 'below'>
        <div
          onMouseOver={()=>this.toggle(true)}
          onMouseOut={()=>this.toggle(false)}
          style={PopupTriggerStyles}>
        </div>
      </Popover>
    );
  }
})

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
    const leftStyle = ['0%', '25%', '50%', '98%', '100%'].map((item)=>{return {left: item}});


    const latestDate = moment(this.props.timeline.data[0].timestamp).valueOf();
    const earlyDate  = moment(this.props.timeline.data[this.props.timeline.data.length-1].timestamp).valueOf();
    const range      = latestDate - earlyDate;

    const Items = this.props.timeline.data.map((item)=> {
      const percentage = 100 - ((latestDate - moment(item.timestamp).valueOf())/range * 100);
      const posStyle = {left: percentage+'%'};
      return <a key={item._id} className={classNames(styles.dot, {[styles.active]: this.props.timeline.selected._id == item._id})} style={posStyle} onClick={()=>this.props.TimelineActions.selectTimelineItem({projectId: this.props.project._id, selected: item})}><PopupTrigger item={item} /></a>
    });

    return (
      <div className={styles.timeline +' layout-row'}>
        <div className={styles.line}>
          {Items}
        </div>
      </div>
    );
  }
})
