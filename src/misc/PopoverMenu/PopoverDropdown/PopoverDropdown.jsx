import React, { Component } from 'react'
import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import Popover from 'stemn-shared/misc/Popover'
import PopoverFit from 'stemn-shared/misc/PopoverMenu/PopoverFit'
import MdExpandMore from 'react-icons/md/expand-more'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import classNames from 'classnames'
import classes from './PopoverDropdown.css'


//        <Button className={ classNames('light', className) } style={ style } buttonRef={ this.getButtonRef }>
//          { children[0] }
//        </Button>

class PopoverDropdown extends Component {
  render() {
    const { children, options, model, value, dispatch, onChange, empty, loading, className, placeholder, style, ...otherProps } = this.props

    const isActive = (option) => value === option.value || (!value && !option.value)

    const currentOption = options.find(isActive)

    const getInnerText = () => {
      if (currentOption && currentOption.name) {
        return currentOption.name
      } else if (empty) {
        return null
      } else {
        return placeholder || 'none'
      }
    }

    return (
      <PopoverFit { ...otherProps }>
        <Button className={ classNames('layout-row layout-align-start-center flex rel-box light', className) } style={ style }>
          <LoadingOverlay className={ classes.loading } show={ loading } linear hideBg />
          { children }
          { getInnerText() }
          <div className="flex" />
          <MdExpandMore style={ { marginLeft: '5px' } } size={ 13 } />
        </Button>
        <div className="PopoverMenu" style={ { maxHeight: '300px' } }>
          { options.map((option, idx) => {

            const onClick = () => {
              if (model) {
                dispatch(storeChange(model, option.value))
              }
              if (option.onClick) {
                option.onClick()
              }
              if (onChange) {
                onChange()
              }
            }

            return (
              <a
                key={ option.value || idx }
                onClick={ onClick }
                className={ classNames({ 'active' : isActive(option) }) }
              >
                { option.name }
              </a>
            )
          })}
        </div>
      </PopoverFit>
    )
  }
}

export default connect()(PopoverDropdown)
