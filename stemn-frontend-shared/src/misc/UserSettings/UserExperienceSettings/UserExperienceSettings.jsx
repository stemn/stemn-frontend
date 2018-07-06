import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { storePush, storeRemove } from 'stemn-shared/misc/Store/Store.actions'
import { range } from 'lodash'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import { Row, Col } from 'stemn-shared/misc/Layout'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import FilledIconButton from 'stemn-shared/misc/Buttons/FilledIconButton'
import classes from './UserExperienceSettings.css'
import cn from 'classnames'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdClose from 'react-icons/md/close'
import MdAdd from 'react-icons/md/add'
import FlipMove from 'react-flip-move/dist/react-flip-move.js'
import getUuid from 'stemn-shared/utils/getUuid.js'

@connect()
export default class UserExperienceSettings extends Component {
  static propTypes = {
    dataModel: PropTypes.string,
    data: PropTypes.array,
    type: PropTypes.oneOf(['education', 'experience']),
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.dateRange = range(1940, 2025).map(year => ({
      name: year,
      value: year,
    }))
  }

  remove = (idx) => {
    const { dispatch, dataModel } = this.props
    dispatch(storeRemove(dataModel, idx))
  }
  add = () => {
    const { dispatch, dataModel } = this.props
    dispatch(storePush(dataModel, {
      _id: getUuid(),
    }))
  }
  render() {
    const { dataModel, type, data } = this.props

    return (
      <div>
        <FlipMove duration={ 200 } enterAnimation="fade" leaveAnimation="fade">
          { data.map((item, idx) => {
            const itemModel = `${dataModel}.[${idx}]`

            const getTopSection = () => {
              if (type === 'education') {
                return (
                  <Row className="sm layout-row">
                    <Col className="sm flex-33">
                      <h3>Degree/Certificate Type</h3>
                      <Input
                        className="dr-input"
                        model={ `${itemModel}.degree` }
                        value={ item.degree }
                        placeholder="eg: Bachelor"
                      />
                    </Col>
                    <Col className="sm flex-33">
                      <h3>Field of Study</h3>
                      <Input
                        className="dr-input"
                        model={ `${itemModel}.fieldOfStudy` }
                        value={ item.fieldOfStudy }
                        placeholder="eg: Mechanical Engineering"
                      />
                    </Col>
                    <Col className="sm flex-33">
                      <h3>School/University</h3>
                      <Input
                        className="dr-input"
                        model={ `${itemModel}.school` }
                        value={ item.school }
                        placeholder="eg: MIT"
                      />
                    </Col>
                  </Row>
                )
              } 
              return (
                <Row className="sm layout-row">
                  <Col className="sm flex-50">
                    <h3>Position</h3>
                    <Input
                      className="dr-input"
                      model={ `${itemModel}.position` }
                      value={ item.position }
                      placeholder="eg: Mechanical Design Engineer "
                    />
                  </Col>
                  <Col className="sm flex-50">
                    <h3>Company</h3>
                    <Input
                      className="dr-input"
                      model={ `${itemModel}.company` }
                      value={ item.company }
                      placeholder="eg: SpaceX"
                    />
                  </Col>
                </Row>
              )
            }

            return (
              <div  key={ item._id }>
                <InfoPanel
                  className={ classes.panel }
                >
                  <FilledIconButton
                    onClick={ () => this.remove(idx) }
                    className={ cn(classes.closeButton, 'warn') }
                  >
                    <MdClose size={ 20 } />
                  </FilledIconButton>
                  { getTopSection() }
                  <br />
                  <h3>Time Period</h3>
                  <Row className="sm layout-row layout-align-start-center">
                    <Col className="sm">
                      <PopoverDropdown
                        model={ `${itemModel}.startDate.year` }
                        value={ item.startDate && item.startDate.year }
                        className={ cn(classes.dateInput, 'input') }
                        options={ this.dateRange }
                        placeholder="Start Year"
                      />
                    </Col>
                    { !item.isCurrent && <Col className="sm">to</Col> }
                    { !item.isCurrent &&
                      <Col className="sm">
                        <PopoverDropdown
                          model={ `${itemModel}.endDate.year` }
                          value={ item.endDate && item.endDate.year }
                          className={ cn(classes.dateInput, 'input') }
                          options={ this.dateRange }
                          placeholder="End Year"
                        />
                      </Col>
                    }
                    { !item.isCurrent &&
                      <Col className="sm">
                        or
                      </Col>
                    }
                    <Col className="sm text-primary">
                      <Checkbox
                        model={ `${itemModel}.isCurrent` }
                        value={ item.isCurrent }
                      />
                    </Col>
                    <Col className="sm">
                      Current?
                    </Col>

                  </Row>
                  <br />
                  <h3>Description</h3>
                  <Textarea
                    className="dr-input"
                    model={ `${itemModel}.notes` }
                    value={ item.notes }
                  />
                </InfoPanel>
              </div>
            )
          })}
        </FlipMove>
        <div className="layout-row layout-align-center">
          <FilledIconButton onClick={ this.add } className="primary">
            <MdAdd size={ 20 } />
          </FilledIconButton>
        </div>
      </div>
    )
  }
}
