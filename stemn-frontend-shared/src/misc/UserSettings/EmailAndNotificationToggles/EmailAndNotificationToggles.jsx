import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getToggleData, emailToggles, websiteToggles } from './EmailAndNotificationToggles.utils'
import Toggle from 'stemn-shared/misc/Input/Toggle/Toggle'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import classes from './EmailAndNotificationToggles.css'
import cn from 'classnames'
import { uniq } from 'lodash'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'

class ToggleGroup extends Component {
  static propTypes = {
    toggleValues: PropTypes.object.isRequired,
    toggleModel: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    saveSettings: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      isToggledOpen: false,
    }
  }
  togglePanelOpen = () => {
    this.setState({
      isToggledOpen: !this.state.isToggledOpen,
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
    } 
    return uniqueGroupToggleValues[0]
  }
  toggleAll = ({ value }) => {
    const { group, toggleModel, change } = this.props
    group.toggles.forEach((toggleName) => {
      change(`${toggleModel}.${toggleName}`, value)
    })
    this.saveSettings()
  }
  saveSettings = () => {
    // Save in the next tick so the changes have completed.
    setTimeout(this.props.saveSettings, 1)
  }
  render() {
    const { toggleValues, toggleModel, group } = this.props
    const { isToggledOpen } = this.state
    const groupToggleValue = this.getGroupToggleValue()
    const isOpen = isToggledOpen || groupToggleValue === 'semi'

    const childRowHeight = 100
    const dividerHeight = 50
    const panelContentStyle = isOpen
      ? { maxHeight: `${childRowHeight * group.toggles.length + dividerHeight}px` }
      : {}

    return (
      <InfoPanel className={ classes.panel }>
        <div className={ cn(classes.parentRow, 'layout-row layout-align-start-center')  }>
          <div className="flex">
            <h3>{ group.title }</h3>
            <p>{ group.description }</p>
          </div>
          <div className="layout-xs-column layout-gt-xs-row layout-align-xs-center layout-align-gt-xs-start-center">
            <SimpleIconButton
              disabled={ groupToggleValue === 'semi' }
              className={ cn(classes.iconButton, { [classes.iconButtonOpen]: isOpen }) }
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
        </div>
        <div className={ classes.childToggles } style={ panelContentStyle }>
          <div className={ classes.divider } />
          { group.toggles.map((toggleName) => {
            const toggle = getToggleData(toggleName)
            return (
              <div
                className={ cn(classes.childRow, 'layout-row layout-align-start-center') }
                key={ toggleName }
              >
                <div className="flex">
                  <h3>{ toggle.name }</h3>
                  <p>{ toggle.description }</p>
                </div>
                <Toggle
                  className={ cn(classes.miniToggle, classes.toggle) }
                  model={ `${toggleModel}.${toggleName}` }
                  value={ toggleValues[toggleName] }
                  changeAction={ this.saveSettings }
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
  static propTypes = {
    type: PropTypes.oneOf(['mail', 'notifications']).isRequired,
    toggleValues: PropTypes.object.isRequired,
    toggleModel: PropTypes.string.isRequired,
    saveSettings: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }
  render() {
    const { toggleValues, toggleModel, change, type, saveSettings } = this.props
    const toggles = type === 'mail'
      ? emailToggles
      : websiteToggles

    return (
      <div>
        { emailToggles.map(group => (
          <ToggleGroup
            key={ group.name }
            toggleValues={ toggleValues }
            toggleModel={ toggleModel }
            group={ group }
            saveSettings={ saveSettings }
            change={ change }
          />
        ))}
      </div>
    )
  }
}
