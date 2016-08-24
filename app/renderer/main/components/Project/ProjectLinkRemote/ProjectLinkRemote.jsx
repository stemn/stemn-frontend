import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import 'app/renderer/assets/css/select.css';
import { actions } from 'react-redux-form';


//import RadioAlt from 'app/renderer/main/components/Input/RadioAlt/RadioAlt.jsx'

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  onChangeFn(val){
    this.props.dispatch(actions.change(this.props.model, val.value))
  },
  render(){
    const {model, value, dispatch} = this.props

    var options = [
      { value: 'dropbox', label: 'Dropbox' },
      { value: 'drive', label: 'Drive' },
      { value: 'none', label: 'None' }
    ];

    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          options={options}
          onChange={this.onChangeFn}
          clearable="false"
        />
      </div>
    );
  }
});


export default connect()(Component);


//        <RadioAlt model={model} value='dropbox'>
//          Connect Dropbox
//        </RadioAlt>
//        <RadioAlt model={model} value='drive'>
//          Connect Drive
//        </RadioAlt>
//        <RadioAlt model={model} value='none'>
//          None
//        </RadioAlt>
