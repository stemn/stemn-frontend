import StandardLayout from 'layout/StandardLayout'
import SubHeader from 'modules/SubHeader'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { replace as replaceType } from 'react-router-redux'
import { Col, Container, Row } from 'stemn-shared/misc/Layout'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import { ProjectRowContainer } from 'stemn-shared/misc/Projects/ProjectRow'
import SiteSearchResults from 'stemn-shared/misc/Search/SiteSearchResults'
import * as classes from './Explore.scss'

export interface IExploreProps {
  replace: typeof replaceType,
  location: any,
}

export default class Explore extends React.Component<IExploreProps> {
  public orderOptions = [{
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
  public connectedOptions = [{
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
  public updateOrder = (sort) => this.props.replace({
    pathname: window.location.pathname,
    query: {
      sort,
    },
  })
  public updateConnected = (store) => this.props.replace({
    pathname: window.location.pathname,
    query: {
      store,
    },
  })
  public render () {
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
        <SubHeader title='Explore' noResponsive>
          <div className='layout-row layout-align-center-center'>
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
          <div className='text-mini-caps' style={ { marginBottom: '10px' } }>Featured Projects</div>
           <div style={ { marginBottom: '30px' } }>
            <ProjectRowContainer
              projectId='5a88fb1a55e8c8000f5912db'
              className={ classes.project }
              size='wide'
            />
            <ProjectRowContainer
              projectId='5a88fb1a55e8c8000f5912db'
              className={ classes.project }
              size='wide'
            />
           </div>
          <Row className='layout-xs-col layout-gt-xs-row'>
            <Col className='flex-gt-xs-70'>
              <div className='text-mini-caps' style={ { marginBottom: '10px' } }>Latest Projects</div>
              <SiteSearchResults
                type='project'
                page={ parseInt(location.query.page, 10) }
                size={ 30 }
                sort={ location.query.sort || 'updated' }
                criteria={ criteria }
              />
            </Col>
            <Col className='flex-gt-xs-30'>
              <div className='text-mini-caps' style={ { marginBottom: '10px' } }>Popular Fields</div>
              <SiteSearchResults
                display='tag'
                type='field'
                page={ parseInt(location.query.page, 10) }
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
