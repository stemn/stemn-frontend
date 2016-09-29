import React from 'react';
import Popover from 'app/renderer/assets/other/react-popup';

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
    const { preferPlace, trigger, disableClickClose, children, className } = this.props;

    const contentElement = (
      <div onClick={()=>disableClickClose ? null : this.toggle(false)}>
        {this.props.children[1]}
      </div>
    )

    const getTriggerElement = () => {
      if(trigger == 'hover'){
        return (
          <div
            className={className}
            onMouseOver={()=>this.toggle(true)}
            onMouseOut={()=>this.toggle(false)}>
            {children[0]}
          </div>
        )
      }
      else{
        return (
          <div
            className={className}
            onClick={()=>this.toggle(null)}>
            {children[0]}
          </div>
        )
      }
    }

    return (
      <Popover
        isOpen={this.state.isOpen}
        body={contentElement}
        onOuterAction={()=>this.toggle(false)}
        preferPlace = {preferPlace || 'above'}>
        {getTriggerElement()}
      </Popover>
    );
  }
})


