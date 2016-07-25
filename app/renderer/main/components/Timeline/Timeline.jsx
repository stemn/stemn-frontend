import React from 'react';
import Popover from '../../../assets/other/react-popup';


// Styles
import styles from './Timeline.css';
import classNames from 'classnames';


const PopupContent = (item) =>{
  return (
    <div className={styles.popup + ' layout-row layout-align-start-center'}>
      <img className={styles.popupImage} src={'https://stemn.com' + item.actor.picture + '?size=thumb&crop=true'} />
      <div className="flex">
        <div>Initial Commit</div>
        <div>20 hours ago by {item.actor.name}</div>
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

    return (
      <div className={styles.timeline +' layout-row'}>
        <div className={styles.line}>
          <div className={styles.dot} style={leftStyle[0]}><PopupTrigger item={this.props.sidebarTimeline.timeline[0]} /></div>
          <div className={styles.dot} style={leftStyle[1]}><PopupTrigger item={this.props.sidebarTimeline.timeline[0]} /></div>
          <div className={styles.dot} style={leftStyle[2]}><PopupTrigger item={this.props.sidebarTimeline.timeline[0]} /></div>
          <div className={styles.dot} style={leftStyle[3]}><PopupTrigger item={this.props.sidebarTimeline.timeline[0]} /></div>
          <div className={styles.dot} style={leftStyle[4]}><PopupTrigger item={this.props.sidebarTimeline.timeline[0]} /></div>
        </div>
      </div>
    );
  }
})
