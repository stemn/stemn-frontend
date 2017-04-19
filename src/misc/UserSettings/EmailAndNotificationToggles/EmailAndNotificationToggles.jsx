import React, { Component, PropTypes } from 'react'
import { getToggleData, emailToggles } from './EmailAndNotificationToggles.utils'
import Toggle from 'stemn-shared/misc/Input/Toggle/Toggle'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import classes from './EmailAndNotificationToggles.css'
import classNames from 'classnames'
import { uniq } from 'lodash'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz';

class ToggleGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isToggledOpen: false
    }
  }
  togglePanelOpen = () => {
    this.setState({
      isToggledOpen: !this.state.isToggledOpen
    })
  }
  getGroupToggleValue = () => {
    // This will get the toggle status of the parent group.
    // true if all true, false if all false, 'semi' if heterogeneous
    const { toggleValues, group } = this.props
    const groupToggleValues = group.toggles.map(toggleName => toggleValues[toggleName] || false)
    const uniqueGroupToggleValues = uniq(groupToggleValues)
    if (uniqueGroupToggleValues.length > 1) {
      return 'semi'
    } else {
      return uniqueGroupToggleValues[0]
    }
  }
  toggleAll = ({ value }) => {
    const { group, toggleModel, change } = this.props
    group.toggles.forEach(toggleName => {
      change(`${toggleModel}.${toggleName}`, value)
    })
  }
  render () {
    const { toggleValues, toggleModel, group } = this.props
    const { isToggledOpen } = this.state
    const groupToggleValue = this.getGroupToggleValue()
    const isOpen = isToggledOpen || groupToggleValue === 'semi'

    const childRowHeight = 80
    const dividerHeight = 30
    const panelContentStyle = isOpen
      ? { maxHeight: `${ childRowHeight * group.toggles.length + dividerHeight }px` }
      : {}

    return (
      <InfoPanel className={ classes.panel }>
        <div className={ classNames(classes.parentRow, 'layout-row layout-align-start-center')  }>
          <div className="flex">
            <h3>{ group.title }</h3>
            <p>{ group.description }</p>
          </div>
          <SimpleIconButton
            disabled={ groupToggleValue === 'semi' }
            className={ classNames(classes.iconButton, {[classes.iconButtonOpen] : isOpen}) }
            onClick={ this.togglePanelOpen }
          >
            <MdMoreHoriz size={ 25 } />
          </SimpleIconButton>
          <Toggle
            className={ classes.toggle }
            changeAction={ this.toggleAll }
            value={ groupToggleValue }
          />
        </div>
        <div className={ classes.childToggles } style={ panelContentStyle }>
          <div className={ classes.divider } />
          { group.toggles.map(toggleName => {
            const toggle = getToggleData(toggleName);
            return (
              <div className={ classNames(classes.childRow, 'layout-row layout-align-start-center') }>
                <div className="flex">
                  <h3>{ toggle.name }</h3>
                  <p>{ toggle.description }</p>
                </div>
                <Toggle
                  className={ classNames(classes.miniToggle, classes.toggle) }
                  model={ `${toggleModel}.${toggleName}` }
                  value={ toggleValues[toggleName] }
                />
              </div>
            )
          })}
        </div>
      </InfoPanel>
    )
  }
}

export default class EmailAndNotificationToggles extends Component {
  render () {
    const { toggleValues, toggleModel, change } = this.props
    return (
      <div>
        { emailToggles.map(group => (
          <ToggleGroup
            toggleValues={ toggleValues }
            toggleModel={ toggleModel }
            group={ group }
            change={ change }
          />
        ))}
      </div>
    )
  }
}
