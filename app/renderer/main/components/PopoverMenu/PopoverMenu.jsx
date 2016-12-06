import React from 'react';
import Popover from 'app/renderer/assets/other/react-popup';

export default React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggleDelayTime: 200,
  toggleDelayTimeout: null,
  toggleDelay (toState){
    clearTimeout(this.toggleDelayTimeout);
    this.toggleDelayTimeout = setTimeout(()=>{
      this.toggle(toState);
    }, this.toggleDelayTime)
  },
  componentWillUnmount(){
    clearInterval(this.toggleDelayTimeout);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true || nextProps.open === false){
      this.setState({ isOpen: nextProps.open })
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const { preferPlace, trigger, disableClickClose, tipSize, offset, children, className } = this.props;
    const tipSizeDefault = tipSize || 0;
    const triggerMap = {
      hover          : {
        onMouseEnter : () => {this.toggle(true)},
        onMouseLeave : () => {this.toggle(false)}
      },
      hoverDelay     : {
        onMouseEnter : () => {this.toggleDelay(true)},
        onMouseLeave : () => {this.toggleDelay(false)}
      },
      click          : {
        onClick      : () => {this.toggle(null)},
        onContextMenu : (e) => {
          e.preventDefault();
          this.toggle(null)
        }
      },
      none          : {},
    };

    const contentMap = {
      hover          : {},
      hoverDelay     : {
        onMouseEnter : () => {this.toggleDelay(true)},
        onMouseLeave : () => {this.toggleDelay(false)},
      },
      click          : {
        onClick      : () => {disableClickClose ? null : this.toggle(false)}
      },
      none           : {},
    }

    const triggerProps = triggerMap[trigger] || triggerMap['click']; // Default to click
    const contentProps = contentMap[trigger] || contentMap['click']; // Default to click

    return (
      <Popover
        isOpen={this.state.isOpen}
        body={React.cloneElement(children[1], contentProps)}
        onOuterAction={()=>{if(trigger != 'none'){this.toggle(false)}}}
        preferPlace = {preferPlace || 'above'}
        tipSize={tipSizeDefault}
        offset={offset}>
        {React.cloneElement(children[0], triggerProps)}
      </Popover>
    );
  }
})
