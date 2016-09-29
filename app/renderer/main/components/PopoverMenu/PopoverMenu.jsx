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

    const triggerProps = trigger == 'hover'
    ? {
      onMouseOver: () => {this.toggle(true)},
      onMouseOut: () => {this.toggle(false)}
    } : {
      onClick: () => {this.toggle(null)}
    };

    const contentProps = {
      onClick: () => {disableClickClose ? null : this.toggle(false)}
    }

    return (
      <Popover
        isOpen={this.state.isOpen}
        body={React.cloneElement(children[1], contentProps)}
        onOuterAction={()=>this.toggle(false)}
        preferPlace = {preferPlace || 'above'}>
        {React.cloneElement(children[0], triggerProps)}
      </Popover>
    );
  }
})


