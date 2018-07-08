import React, { Component } from 'react'
import { connect } from 'react-redux'
import { storeRemove, storePush } from 'stemn-shared/misc/Store/Store.actions'

import CheckboxAlt from 'stemn-shared/misc/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './LabelSelect.css'

class LabelSelectRow extends Component {
  onChange = () => {
    // The onChange function works like a checkbox
    const { item, dispatch, value, model, onChange } = this.props
    const labelIndex = value ? value.indexOf(item._id) : -1
    if (labelIndex !== -1) {
      dispatch(storeRemove(model, labelIndex))
    } else {
      dispatch(storePush(model, item._id))
    }
    if (onChange) { onChange() } // Run the onChange function if required
  }
  render() {
    const {
      item,
      value,
    } = this.props
    const status = value ? value.includes(item._id) : false

    return (
      <CheckboxAlt
        status={ status }
        value={ item._id }
        onChange={ this.onChange }
        className="layout-row layout-align-start-center"
        tickOnly
      >
        <div
          className={ classes.swatch }
          style={ { background: item.color } }
        />
        { item.name }
      </CheckboxAlt>
    )
  }
}

class LabelSelect extends Component {
  render() {
    const { model, value, labelInfo, dispatch, onChange } = this.props

    // Filter out online labels with a name and color
    const filteredInfo = labelInfo.filter(label => label.name && label.color)

    return (
      <div>
        { filteredInfo.map(item => (
          <LabelSelectRow
            item={ item }
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
