import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import selectCss from 'app/renderer/assets/css/select.css';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  onChangeFn(items){
    const result = items.map(item => this.props.users.find(user => user._id == item.value));
    this.props.dispatch(actions.change(this.props.model, result));
    if(this.props.onChange){ this.props.onChange() }
  },
  render(){
    const {model, value, users, dispatch} = this.props

    const userOptions = users.map(user => {
      return {
        value: user._id,
        label: user.name
      }
    });

    const mappedValue = value.map(user => user._id);

    return (
      <div>
        <Select
          name="form-field-name"
          value={mappedValue}
          options={userOptions}
          onChange={this.onChangeFn}
          clearable={false}
          multi={true}
        />
      </div>
    );
  }
});

export default connect()(Component);
