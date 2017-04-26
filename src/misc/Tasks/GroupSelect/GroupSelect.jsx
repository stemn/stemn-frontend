import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import CheckboxAlt from 'stemn-shared/misc/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './GroupSelect.css'

class LabelSelectRow extends Component {
  onChange = () => {
    const { group, dispatch, model, onChange } = this.props
    dispatch(actions.change(model, group._id))
    if (onChange) { onChange() } // Run the onChange function if required
  }
  render() {
    const { group, value, onChange } = this.props
    const status = value ? value.includes(group._id) : false

    return (
      <CheckboxAlt
        status={ status }
        value={ group._id }
        onChange={ this.onChange }
        className="layout-row layout-align-start-center"
        tickOnly
      >
        <div style={ { paddingLeft: '5px'} }>
          { group.name }
        </div>
      </CheckboxAlt>
    )
  }
}

class LabelSelect extends Component {
  render() {
    const { model, value, groups, dispatch, onChange } = this.props;

    return (
      <div>
        { groups.map((group) => (
          <LabelSelectRow
            group={ group }
            model={ model }
            value={ value }
            onChange={ onChange }
            dispatch={ dispatch }
          />
        ))}
      </div>
    )
  }
}

export default connect()(LabelSelect)
