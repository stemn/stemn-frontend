import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileCompareSlider.css'

import clickDrag from 'react-clickdrag';


const Component = React.createClass({
  getInitialState () {
    return {
      active: false,
      lastEventId: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataDrag.isMoving && nextProps.dataDrag.id && nextProps.dataDrag.id != this.state.lastEventId) {
      const containerWidth = this.props.container.offsetWidth;
      const prevPositionPx = nextProps.position / 100 * containerWidth;
      let newPositionPx  = prevPositionPx + nextProps.dataDrag.deltaX;
      if(newPositionPx <= 0) {newPositionPx = 0}
      else if(newPositionPx >= containerWidth){newPositionPx = containerWidth}
      const positionPerc = newPositionPx / containerWidth * 100;
      this.setState({active: true});
      this.setState({lastEventId: nextProps.dataDrag.id});
      this.props.changeFn(positionPerc);
    }
    else {
      this.setState({active: false});
    }
  },

  render() {
    const translation = this.props.position+'%';
    return(
      <div className={classNames(classes.slider, {[classes.active] : this.state.active})} style={{left: translation}}></div>
    )
  }
});


export default clickDrag(Component, {touch: true});

