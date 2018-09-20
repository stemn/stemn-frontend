import React, { Component } from 'react'
import classes from './PricingTable.scss'
import MdDone from 'react-icons/md/done'
import cn from 'classnames'

export default class PricingTable extends Component {
  render() {
    const { important, data } = this.props
    return (
      <div data-tag="pricingColumn" className={ cn('flex', 'flex-sm-50 layout-column', classes.table, { [classes.important]: important }) }>
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
