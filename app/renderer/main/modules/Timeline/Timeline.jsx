// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarTimelineActions from 'app/shared/actions/sidebarTimeline';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import styles from './Timeline.css';

// Sub Components
import moment from 'moment';
import Popover from 'app/renderer/assets/other/react-popup';
import * as stringConcat from 'app/shared/helpers/stringConcat';
import MoreDots from './MoreDots/MoreDots.jsx';
import MoreButton from './MoreButton/MoreButton.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const PopupContent = (item) =>{
  const timeFromNow = moment(item.timestamp).fromNow();

  return (
    <div className={styles.popup + ' layout-row layout-align-start-center'}>
      <img className={styles.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />
      <div className="flex">
        {/*<b>{stringConcat.end(item.data.summary, 30)}</b> */}
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

export const Component = React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  scroll (direction){
    console.log(direction);
  },
  render() {
    const numberToShow = '10';


    return (
      <div className={styles.timeline +' layout-row'}>
        <div className={styles.line}>
          <MoreButton onClick={()=>this.scroll('left')} side="left"/>
          <MoreButton onClick={()=>this.scroll('right')} side="right"/>
          <MoreDots side="left" />
          <MoreDots side="right" />
          {/*Items*/}
        </div>
      </div>
    );
  }
});


//    const latestDate = moment(this.props.timeline.data[0].timestamp).valueOf();
//    const earlyDate  = moment(this.props.timeline.data[this.props.timeline.data.length-1].timestamp).valueOf();
//    const range      = latestDate - earlyDate;
//
//    const Items = this.props.timeline.data.map((item)=> {
//      const percentage = 100 - ((latestDate - moment(item.timestamp).valueOf())/range * 100);
//      const posStyle = {left: percentage+'%'};
//      return <a key={item._id} className={classNames(styles.dot, {[styles.active]: this.props.timeline.selected._id == item._id})} style={posStyle} onClick={()=>this.props.TimelineActions.selectTimelineItem({projectId: this.props.project._id, selected: item})}><PopupTrigger item={item} /></a>
//    });

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ sidebarTimeline }, {project}) {
  return {
    timeline: sidebarTimeline[project._id],
    project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TimelineActions: bindActionCreators(SidebarTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
