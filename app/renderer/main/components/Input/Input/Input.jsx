import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { omit } from 'lodash';

export const Component = React.createClass({
  getInitialState () {
    return {
      value: this.props.value,
    }
  },
  onChange(event){
    this.props.dispatch(actions.change(this.props.model, event.target.value));
    this.setState({value: event.target.value});
  },
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if(nextProps.value != this.state.value){
      this.setState({ value: nextProps.value })
    }
  },
  render() {
    const otherProps = omit(this.props, ['dispatch', 'model', 'value']);
    const { value } = this.state;
    return <input {...otherProps} onChange={this.onChange} value={value}/>
  }
});

export default connect()(Component);
