
import React from 'react';
import clickDrag from 'react-clickdrag';

// Styles
import classNames from 'classnames';
import classes from './DragResize.css';


const DraggerComponent = React.createClass({
  getInitialState () {
    return {
      lastEventId: null,
      active: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataDrag.isMoving && nextProps.dataDrag.id && nextProps.dataDrag.id != this.state.lastEventId) {
      this.setState({active: true, lastEventId: nextProps.dataDrag.id});
      if(nextProps.side == 'left' || nextProps.side == 'right'){
        this.props.changeFn({
          deltaX: nextProps.side == 'right' ? nextProps.dataDrag.deltaX : - nextProps.dataDrag.deltaX,
        });
      }
      else{
        this.props.changeFn({
          deltaY: nextProps.side == 'bottom' ? nextProps.dataDrag.deltaY : - nextProps.dataDrag.deltaY
        });
      }
    }
    else {
      this.setState({active: false});
    }
  },

  render() {
    const styles = {
      right: {
        width: '6px',
        top: '0',
        bottom: '0',
        right: '0',
        marginRight: '-6px',
        cursor: 'col-resize'
      },
      left: {
        width: '6px',
        top: '0',
        bottom: '0',
        left: '0',
        marginLeft: '-6px',
        cursor: 'col-resize'
      },
      bottom: {
        height: '6px',
        bottom: '0',
        right: '0',
        left: '0',
        marginBottom: '0px',
        cursor: 'row-resize'
      },
      top: {
        height: '6px',
        top: '0',
        right: '0',
        left: '0',
        marginTop: '-3px',
        cursor: 'row-resize'
      }
    }

    return(
      <div className={classes.dragger} style={styles[this.props.side]}/>
    )
  }
});

const Dragger = clickDrag(DraggerComponent, {touch: true});

export default React.createClass({
  getInitialState () {
    if(this.props.width){
      return {width: parseInt(this.props.width)};
    }
    else if (this.props.height){
      return {height: parseInt(this.props.height)};
    }
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.animateHide != this.props.animateHide){
      if(nextProps.width){
        this.setState({width: nextProps.animateHide ? '0' : nextProps.width, animate: true});
      }
      else{
        this.setState({height: nextProps.animateHide ? '0' : nextProps.height, animate: true});
      }
      setTimeout(()=>this.setState({animate: false}), 300)
    }
  },

  drag (change) {
    const { widthRange, heightRange } = this.props;
    if(change.deltaX){
      let width = parseInt(this.state.width) + change.deltaX;
      if(widthRange){
        if(width < widthRange[0]){width = widthRange[0]}
        else if(width > widthRange[1]){width = widthRange[1]}
      }
      this.setState({width: width});
    }
    else if(change.deltaY){
      let height = parseInt(his.state.height) + change.deltaY;
      if(heightRange){
        if(height < heightRange[0]){height = heightRange[0]}
        else if(height > heightRange[1]){height = heightRange[1]}
      }
      this.setState({height: height});
    }
  },
  render() {
    const style = {
      width: this.state.width + 'px',
      height: this.state.height + 'px',
      transition: this.state.animate ? '0.3s ease all' : 'none'
    }
    return (
      <div style={style} className={classNames(classes.box, this.props.className)}>
        {this.props.children}
        <Dragger changeFn={this.drag} side={this.props.side} />
      </div>
    );
  }
});
