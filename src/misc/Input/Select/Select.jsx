import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import Select from 'react-select';

class Component extends React.Component {
  onChange = (item) => {
    const { dispatch, model } = this.props
    dispatch(actions.change(model, item && item.value))
  }
  render(){
    const { dispatch, model, ...otherProps } = this.props;
    return (
      <Select onChange={ this.onChange } { ...otherProps }/>
    );
  }
};

export default connect()(Component);
