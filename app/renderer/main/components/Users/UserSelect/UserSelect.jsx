import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import selectCss from 'app/renderer/assets/css/select.css';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  onChangeFn(val){
    console.log(val);
    const array =  val.split(',');
    this.props.dispatch(actions.change(this.props.model, array))
  },
  render(){
    const {model, value, users, dispatch} = this.props

    const userOptions = users.map(user => {
      return {
        value: user._id,
        label: user.name
      }
    });

    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          options={userOptions}
          joinValues={true}
          simpleValue={true}
          onChange={this.onChangeFn}
          clearable={false}
          multi={true}
        />
      </div>
    );
  }
});


export default connect()(Component);
