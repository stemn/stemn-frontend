import React, { Component } from 'react'
import { connect } from 'react-redux'
import FieldOverview from './FieldOverview'

const stateToProps = ({ fields }, { params }) => {
  const fieldId = params.fieldId
  return {
    fieldId,
    field: fields[fieldId],
  }
}

const dispatchToProps = {

}

export default connect(stateToProps, dispatchToProps)(FieldOverview)
