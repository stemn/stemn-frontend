import React, { Component, PropTypes } from 'react'

import LandingLayout from 'layout/LandingLayout'
import HeroBanner from 'modules/HeroBanner'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Container } from 'stemn-shared/misc/Layout'
import PricingTable from 'stemn-shared/misc/Billing/PricingTable'
import { pricingTableData } from 'stemn-shared/misc/Billing/Billing.data'
import classes from './Pricing.scss'
import classNames from 'classnames'

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
            <PricingTable data={ pricingTableData[0] }/>
            <PricingTable data={ pricingTableData[1] }/>
            <PricingTable data={ pricingTableData[2] } important/>
            <PricingTable data={ pricingTableData[3] }/>
          </div>
          <div className={ classes.currencyInfo }>
            <div className="text-mini-caps">All Prices in USD</div>
          </div>
          <div className={ classes.changePlan + ' layout-column layout-align-center-center'}>
            <h3 className="text-title-2">Plans coming soon</h3>
            <h4 className="text-title-4">
              While in Beta, all users will have access to the <b>Stemn Beta</b> plan offering free public & private projects.<br />
              Other plans will come into effect after the Beta is finished.
            </h4>
          </div>
        </Container>
      </LandingLayout>
    )
  }
}
//            <Button className="lg secondary">Get Started For Free</Button>
