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
    return (
      <Popover
        isOpen={this.state.isOpen}
        body={this.props.children[1]}
        onOuterAction={()=>this.toggle(false)}
        preferPlace = 'above'>
        <div
          className="flex"
          onClick={()=>this.toggle(null)}>
          {this.props.children[0]}
        </div>
      </Popover>
    );
  }
})
