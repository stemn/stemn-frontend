import React, { Component } from 'react'
import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container } from 'stemn-shared/misc/Layout'
import { has, get } from 'lodash'
import { Helmet } from 'react-helmet'

export default class Field extends Component {
  render() {
    const {
      field,
      children,
    } = this.props
    return (
      <StandardLayout>
        <Helmet>
          { get(field, 'data.name') &&
            <title>{ field.data.name }</title>
          }
        </Helmet>
        <SubHeader title={ get(field, 'data.name', '') } />
        <Container style={ { marginTop: '30px' } }>
          { has(field, 'data._id') && children }
        </Container>
      </StandardLayout>
    )
  }
}

