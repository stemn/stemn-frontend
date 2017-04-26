import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import CheckboxAlt from 'stemn-shared/misc/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './LabelSelect.css'

class LabelSelectRow extends Component {
  onChange = () => {
    // The onChange function works like a checkbox
    const { label, dispatch, value, model, onChange } = this.props
    const labelIndex = value ? value.indexOf(label._id) : -1;
    if (labelIndex !== -1) {
      dispatch(actions.remove(model, labelIndex))
    } else {
      dispatch(actions.push(model, label._id))
    }
    if (onChange) { onChange() } // Run the onChange function if required
  }
  render() {
    const { label, value, onChange } = this.props
    const status = value ? value.includes(label._id) : false

    return (
      <CheckboxAlt
        status={ status }
        value={ label._id }
        onChange={ this.onChange }
        className="layout-row layout-align-start-center"
        tickOnly
      >
        <div
          className={ classes.swatch }
          style={ { background: label.color } }
        />
        { label.name }
      </CheckboxAlt>
    )
  }
}

class LabelSelect extends Component {
  render() {
    const { model, value, labelInfo, dispatch, onChange } = this.props;

    // Filter out online labels with a name and color
    const filteredInfo = labelInfo.filter( label => label.name && label.color)

    return (
      <div>
        { filteredInfo.map((label) => (
          <LabelSelectRow
            label={ label }
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
