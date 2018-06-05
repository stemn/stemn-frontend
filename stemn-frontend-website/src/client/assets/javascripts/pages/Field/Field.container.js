import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getField } from 'stemn-shared/misc/Fields/Fields.actions'

import Field from './Field'

const stateToProps = ({ fields }, { params }) => {
  const fieldId = params.fieldId
  return {
    fieldId,
    field: fields.data[fieldId],
  }
}

const dispatchToProps = {
  getField,
}

const fetchConfigs = [{
  hasChanged: 'fieldId',
  onChange: (props) => {
    props.getField({
      fieldId: props.fieldId,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class SearchContainer extends Component {
  render() {
    return (
      <Field { ...this.props } />
    )
  }
}
