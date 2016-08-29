import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileCompareSlider.css'

import clickDrag from 'react-clickdrag';


const Component = React.createClass({
  getInitialState () {
    return {
      currentX: 0,
      lastPositionX: 0,
      active: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataDrag.isMoving) {
      const containerWidth = this.props.container.offsetWidth;
      let currentX = this.state.lastPositionX + nextProps.dataDrag.moveDeltaX;
      if(currentX <= 0) {currentX = 0}
      else if(currentX >= containerWidth){currentX = containerWidth}
      const position = currentX / containerWidth * 100;


      if(nextProps.position != position){
        this.props.changeFn(position);
      }
      this.setState({active: true});
      this.setState({currentX: currentX});
    }
    else {
      this.setState({active: false});
      this.setState({lastPositionX: this.state.currentX});
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
