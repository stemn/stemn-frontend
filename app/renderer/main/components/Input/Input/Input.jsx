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
    let newValue = event.target.value;

    // Toggle if checkbox
    if(type == 'checkbox'){
      const isFalse = newValue == 'false' || !newValue;
      newValue = isFalse ? true : false; // toggle
    }
//    else if( type == 'radio'){
//      console.log(newValue);
//      newValue = this.props.value
//    }
    
    if(model){
      this.props.dispatch(actions.change(model, newValue));
    }
    if(changeAction){
      changeAction({value: newValue, model})
    }
    this.setState({value: newValue});
  },
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if(nextProps.value != this.state.value){
      this.setState({ value: nextProps.value })
    }
  },
  componentDidMount(){
    if(this.props.autoFocus){
      setTimeout(() => this.refs.input.focus(), 1);
    }
  },
  render() {
    const otherProps = omit(this.props, ['dispatch', 'model', 'value', 'changeAction']);
    const { value } = this.state;
    return <input ref="input" {...otherProps} onChange={this.onChange} value={value}/>
  }
});

export default connect()(Component);
