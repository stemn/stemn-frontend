import React from 'react';
import Popover from 'app/renderer/assets/other/react-popup';

export default React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggle (toState) {
    console.log('close');
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const disableClickClose = this.props.disableClickClose;
    console.log(disableClickClose);
    const popoverBody = (<div onClick={()=>disableClickClose ? null : this.toggle(false)}>{this.props.children[1]}</div>)
    return (
      <Popover
        isOpen={this.state.isOpen}
        body={popoverBody}
        onOuterAction={()=>this.toggle(false)}
        preferPlace = {this.props.preferPlace || 'above'}>
        <div
          className={this.props.className}
          onClick={()=>this.toggle(null)}>
          {this.props.children[0]}
        </div>
      </Popover>
    );
  }
})
