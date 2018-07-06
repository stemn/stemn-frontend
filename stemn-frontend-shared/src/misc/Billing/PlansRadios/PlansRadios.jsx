import React from 'react'
import Radio from 'stemn-shared/misc/Input/Radio/Radio.jsx'
import { plansData } from 'stemn-shared/misc/Billing/Billing.data'
import classes from './PlansRadios.css'

export default class PlansRadios extends React.Component {
  render() {
    // const { model, value } = this.props
    const value = 'Stemn Beta'
    const model = ''
    return (
      <div>
        { plansData.map(plan => (
          <div key={ plan.name } className={ plan.disabled ? classes.disabled : '' }>
            <Radio model={ model } value={ plan.name } modelValue={ value }>
              <div className="flex" style={ { marginLeft: '5px' } }>
                <div className="text-subtitle-1">{ plan.name }</div>
                <div className="text-description-1">{ plan.description }</div>
              </div>
            </Radio>
          </div>
        ))}
      </div>
    )
  }
}
