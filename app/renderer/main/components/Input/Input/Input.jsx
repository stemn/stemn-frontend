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
    const { model, dispatch, type, changeAction } = this.props;
    let value = event.target.value;

    // Toggle if checkbox
    if(type == 'checkbox'){
      const isFalse = value == 'false' || !value;
      value = isFalse ? true : false; // toggle
    }
    
    if(model){
      this.props.dispatch(actions.change(model, value));
    }
    if(changeAction){
      changeAction({value, model})
    }
    this.setState({value});
  },
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if(nextProps.value != this.state.value){
      this.setState({ value: nextProps.value })
    }
  },
  render() {
    const otherProps = omit(this.props, ['dispatch', 'model', 'value', 'changeAction']);
    const { value } = this.state;
    return <input {...otherProps} onChange={this.onChange} value={value}/>
  }
});

export default connect()(Component);
