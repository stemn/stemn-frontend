import React from 'react';
import clickDrag from 'react-clickdrag';

// Styles
import classes from './DragResize.css';


const Component = React.createClass({
  getInitialState () {
    return {
      currentX: 0,
      lastX: 0,
      active: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataDrag.isMoving) {
      let currentX = this.state.lastX + nextProps.dataDrag.moveDeltaX;

      if(currentX <= 0) {currentX = 0}
      else if(currentX >= containerWidth){currentX = containerWidth}

      this.setState({active: true});
      this.setState({currentX: currentX});
    }
    else {
      this.setState({active: false});
      this.setState({lastX: this.state.currentX});
    }
  },

  render() {
    const translation = this.props.position+'%';
    return(
      <div style={{left: }}/>
    )
  }
});


export default clickDrag(Component, {touch: true});
