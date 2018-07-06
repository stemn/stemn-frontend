import React, { Component } from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import SiteSearchResults from 'stemn-shared/misc/Search/SiteSearchResults'
import classes from './Explore.scss'
import SubHeader from 'modules/SubHeader'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import { Helmet } from 'react-helmet'
export default class Explore extends Component {
  orderOptions = [{
    value: 'views',
    name: 'Views',
    onClick: () => this.updateOrder('views'),
  }, {
    value: 'numComments',
    name: 'Comments',
    onClick: () => this.updateOrder('numComments'),
  }, {
    value: 'follows',
    name: 'Followers',
    onClick: () => this.updateOrder('follows'),
  }, {
    value: undefined,
    name: 'Updated',
    onClick: () => this.updateOrder(undefined),
  }]
  updateOrder = sort => this.props.replace({
    pathname: window.location.pathname,
    query: {
      sort,
    },
  })
  connectedOptions = [{
    value: 'any',
    name: 'Any',
    onClick: () => this.updateConnected('any'),
  }, {
    value: undefined,
    name: 'Connected',
    onClick: () => this.updateConnected(undefined),
  }, {
    value: 'disconnected',
    name: 'Disconnected',
    onClick: () => this.updateConnected('disconnected'),
  }]
  updateConnected = store => this.props.replace({
    pathname: window.location.pathname,
    query: {
      store,
    },
  })
  render() {
    const { location } = this.props

    const getCriteria = () => {
      if (location.query.store === undefined) {
        return { 'remote.connected': true }
      } else if (location.query.store === false) {
        return { 'remote.connected': false }
      }
      return {}
    }
    const criteria = getCriteria()

    return (
      <StandardLayout>
        <Helmet>
          <title>Explore</title>
        </Helmet>
        <SubHeader title="Explore" noResponsive>
          <div className="layout-row layout-align-center-center">
            <PopoverDropdown
              style={ { margin: '0 10px' } }
              value={ location.query.store }
              options={ this.connectedOptions }
            >
              Files:&nbsp;
            </PopoverDropdown>
            <PopoverDropdown
              value={ location.query.sort }
              options={ this.orderOptions }
            >
              Order:&nbsp;
            </PopoverDropdown>
          </div>
        </SubHeader>
        <Container className={ classes.content }>
          <Row className="layout-xs-col layout-gt-xs-row">
            <Col className="flex-gt-xs-70">
              <SiteSearchResults
                type="project"
                page={ parseInt(location.query.page) }
                size={ 30 }
                sort={ location.query.sort || 'updated' }
                criteria={ criteria }
              />
            </Col>
            <Col className="flex-gt-xs-30">
              <SiteSearchResults
                display="tag"
                type="field"
                page={ parseInt(location.query.page) }
                size={ 20 }
                sort={ location.query.sort || 'updated' }
              />
            </Col>
          </Row>
        </Container>
      </StandardLayout>
    )
  }
}
