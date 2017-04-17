import React, { Component, PropTypes } from 'react'
import { range } from 'lodash'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Select from 'stemn-shared/misc/Input/Select'
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import classes from './UserExperienceSettings.css'

export default class UserExperienceSettings extends Component {
//  static propTypes = {
//    user: PropTypes.object.isRequired,
//    authenticate: PropTypes.func.isRequired,
//    unlink: PropTypes.func.isRequired,
//  }
  render () {
    const { experienceModel, experience } = this.props

    console.log(experienceModel);
    console.log(experience);

//    `${entityModel}.data.profile.blurb`

    const dateRange = range(1940, 2025).map(year => ({
      value: year,
      label: year,
    }))

    return (
      <div>
        { experience.map((item, idx) => {
          const itemModel = `${experienceModel}.[${idx}]`
          return (
            <div key={ item._id }>
              <Row className="sm layout-row">
                <Col className="sm flex-50">
                  <Input
                    className="dr-input"
                    model={ `${itemModel}.position` }
                    value={ item.position }
                  />
                </Col>
                <Col className="sm flex-50">
                  <Input
                    className="dr-input"
                    model={ `${itemModel}.company` }
                    value={ item.company }
                  />
                </Col>
              </Row>
              <br />
              <Row className="sm layout-row layout-align-start-center">
                <Col className="sm">
                  <Select
                    model={ `${itemModel}.startDate.year` }
                    value={ item.startDate && item.startDate.year }
                    className={ classes.dateInput }
                    options={ dateRange }
                    placeholder="Start Year"
                  />
                </Col>
                { !item.isCurrent && <Col className="sm">to</Col> }
                { !item.isCurrent &&
                  <Col className="sm">
                    <Select
                      model={ `${itemModel}.endDate.year` }
                      value={ item.endDate && item.endDate.year }
                      className={ classes.dateInput }
                      options={ dateRange }
                      placeholder="End Year"
                    />
                  </Col>
                }
                { !item.isCurrent &&
                  <Col className="sm">
                    or
                  </Col>
                }
                <Col className="sm">
                  <Checkbox
                    className="primary"
                    model={ `${itemModel}.isCurrent` }
                    value={ item.isCurrent }
                  />
                </Col>
                <Col className="sm">
                  Current?
                </Col>

              </Row>
              <br />
              <Textarea
                className="dr-input"
                model={ `${itemModel}.notes` }
                value={ item.notes }
              />
            <br />
            <br />
          </div>
        )
        })}
      </div>
    )
  }
}

//              <Select
//                name="form-field-name"
//                value={value}
//                options={options}
//                onChange={this.onChangeFn}
//                clearable={false}
//              />
