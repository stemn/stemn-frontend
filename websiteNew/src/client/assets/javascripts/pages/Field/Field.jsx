import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'

import classes from './Field.scss'
import classNames from 'classnames'

export default class Field extends Component {
  render() {
    const { field, params, children } = this.props
    if (field && field.data) {
      const fieldParams = {
        fieldId: field.data.stub
      }
      return (
        <StandardLayout>
          <SubHeader title={ field.data.name }>
          </SubHeader>
          <Container style={ { marginTop: '30px' } }>
            { children }
          </Container>
        </StandardLayout>
      )
    } else {
      return null
    }

  }
}

