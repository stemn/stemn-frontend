import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import 'app/renderer/assets/css/select.css';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  onChangeFn(val){
    console.log(val);
    this.props.dispatch(actions.change(this.props.model, val))
  },
  render(){
    const {model, value, dispatch} = this.props

    var options = [
      { value: 'David Revay', label: 'David Revay' },
      { value: 'Jackson Delahunt', label: 'Jackson Delahunt' },
    ];

    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          options={options}
          onChange={this.onChangeFn}
          clearable={false}
          multi={true}
        />
      </div>
    );
  }
});


export default connect()(Component);
