import React, { Component, PropTypes } from 'react'

import SubHeader from 'modules/SubHeader'
import StandardLayout from 'layout/StandardLayout'
import { Container } from 'stemn-shared/misc/Layout'
import Tabs from 'stemn-shared/misc/Tabs/Tabs'
import Link from 'stemn-shared/misc/Router/Link'
import { has, get } from 'lodash'
import { Helmet } from "react-helmet";
import classes from './Field.scss'
import classNames from 'classnames'

export default class Field extends Component {
  render() {
    const { field, params, children } = this.props
    return (
      <StandardLayout>
        <Helmet>
          { get(field, 'data.name') &&
            <title>{ field.data.name }</title>
          }
        </Helmet>
        <SubHeader title={ get(field, 'data.name', '') }>
        </SubHeader>
        <Container style={ { marginTop: '30px' } }>
          { has(field, 'data._id') && children }
        </Container>
      </StandardLayout>
    )
  }
}

