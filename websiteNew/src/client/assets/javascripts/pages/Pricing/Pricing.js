import React, { Component, PropTypes } from 'react'

import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Container } from 'stemn-shared/misc/Layout'

import classes from './Pricing.scss'
import classNames from 'classnames'

import MdDone from 'react-icons/md/done'

class Table extends Component {
  render() {
    const { important, data } = this.props;
    return (
      <div className={ classNames('flex', 'flex-sm-50', classes.table, { [classes.important]: important }) }>
        <div className={ classes.price }>
          { typeof data.price === 'number'
          ? `$${data.price}`
          : data.price }
        </div>
        <div className={ classes.period }>
          { data.period }
        </div>
        <div className={ classes.type }>
          { data.type }
        </div>
        <div className={ classes.description }>
          { data.description }
        </div>
        <ul>
          { data.features.map((feature, idx) => <li key={ idx }><MdDone />{ feature }</li>)}
        </ul>
      </div>
    )
  }
}

const tableData = [{
  price: 'FREE',
  period: 'Forever',
  type: 'Open-source',
  description: 'For public projects',
  features: [
    'Personal Account',
    'Unlimited public projects',
  ],
}, {
  price: 7,
  period: 'Per Month',
  type: 'Solo',
  description: 'Ideal for personal projects',
  features: [
    'Personal Account',
    'Unlimited public projects',
    'Unlimited private projects',
  ],
}, {
  price: 15,
  period: 'Per User / Month',
  type: 'Team',
  description: 'Great for growing teams',
  features: [
    'Personal Account',
    'Unlimited public projects',
    'Unlimited private projects',
    'Unlimited collaborators',
  ],
}, {
  price: 30,
  period: 'Per User / Month',
  type: 'Organisation',
  description: 'Perfect for larger teams',
  features: [
    'Organisation Account',
    'Unlimited public projects',
    'Unlimited private projects',
    'Unlimited collaborators',
  ],
}]

export default class Pricing extends Component {
  render() {
    return (
      <LandingLayout>
        <HeroBanner>
          <h1>Plans for all workflows</h1>
          <h3>Work together across unlimited private projects with a paid plan</h3>
        </HeroBanner>
        <Container>
          <div className={ classNames(classes.tables, 'layout-column layout-gt-xs-row layout-wrap') }>
            <Table data={ tableData[0] }/>
            <Table data={ tableData[1] }/>
            <Table data={ tableData[2] } important/>
            <Table data={ tableData[3] }/>
          </div>
          <div className={ classes.currencyInfo }>
            <div className="text-mini-caps">All Prices in USD</div>
          </div>
          <div className={ classes.changePlan + ' layout-column layout-align-center-center'}>
            <h3 className="text-title-2">Plans coming soon</h3>
            <h4 className="text-title-4">Stemn is currently in Beta. These plans will be available soon.</h4>
          </div>
        </Container>
      </LandingLayout>
    )
  }
}
//            <Button className="lg secondary">Get Started For Free</Button>
