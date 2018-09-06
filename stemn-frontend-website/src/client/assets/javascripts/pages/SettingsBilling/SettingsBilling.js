import React, { Component } from 'react'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable'
import Link from 'stemn-shared/misc/Router/Link'
import PlansRadios from 'stemn-shared/misc/Billing/PlansRadios'
import classes from './SettingsBilling.css'

class SettingsBilling extends Component {
  render() {
    return (
      <div>
        <InfoPanel>
          <h3>Billing</h3>
          <p>Compare all plans <Link name="pricingRoute" className="link-primary">here</Link>. </p>
          <SimpleTable>
            <tr><td>Plan</td><td><b>Stemn Beta</b>, unlimited public and private projects (while in beta).</td></tr>
            <tr><td>Payment</td><td>No payment method on file.</td></tr>
          </SimpleTable>
          <div className={ classes.divider } />
          <PlansRadios />
        </InfoPanel>
        <InfoPanel>
          <h3>Payment History</h3>
          <p>You have not made any payments.</p>
        </InfoPanel>
      </div>
    )
  }
}

export default SettingsBilling
