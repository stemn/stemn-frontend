import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TimelineInner.css';

import clickDrag from 'react-clickdrag';
import moment from 'moment';
import Popover from 'app/renderer/assets/other/react-popup';
import * as stringConcat from 'app/shared/helpers/stringConcat';


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

const PopupContent = (item) =>{
  const timeFromNow = moment(item.timestamp).fromNow();

  return (
    <div className={classes.popup + ' layout-row layout-align-start-center'}>
      {/*<img className={classes.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />*/}
      <div className="flex">
        {/*<b>{stringConcat.end(item.data.summary, 30)}</b> */}
        <div>{timeFromNow} by {item.user.name}</div>
      </div>

    </div>
    )
}


const TimelineDraggable = React.createClass({
  getInitialState () {
    return {
      lastPositionX: 0,
      currentX: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
//    if(nextProps.dataDrag.moveDeltaX > 10){
//      console.log('MOVEIT');
//    }
    if(nextProps.dataDrag.isMoving) {
      this.setState({currentX: this.state.lastPositionX + nextProps.dataDrag.moveDeltaX,});
    }
    else {
      this.setState({lastPositionX: this.state.currentX,});
    }
  },

  render() {
    const { numberToShow, TimelineActions, timeline, project, page} = this.props;

//    const translation = 'translateX('+this.state.currentX+'px)';
    const translation = 'translateX('+page*100+'%)';

    const Items = timeline.data.map((item, index)=> {
      const percentage = 100 - (index) * (100 / numberToShow);
      const posStyle = {left: percentage+'%'};
      return (
        <a key={item._id}
          className={classNames(classes.dot, {[classes.active]: timeline.selected._id == item._id})}
          style={posStyle}
          onClick={()=>TimelineActions.selectTimelineItem({projectId: project._id, selected: item})}>
          <PopupTrigger item={item} />
        </a>
      )
    });

    return(
      <div className={classes.dots} style={{transform: translation}}>
        {Items}
      </div>
    )
  }
});

const Component = clickDrag(TimelineDraggable, {touch: true});

export default Component
