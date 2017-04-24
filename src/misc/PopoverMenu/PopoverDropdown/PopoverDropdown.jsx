import React from 'react'
import { connect } from 'react-redux'
import { actions } from 'react-redux-form'
import Popover from 'stemn-shared/misc/Popover'
import MdExpandMore from 'react-icons/md/expand-more'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import classNames from 'classnames'

const PopoverDropdown = (props) => {
  const { children, options, model, value, dispatch } = props
  const currentOption = options.find(option => option.value === value)
  return (
    <Popover preferPlace="below" tipSize={ 1 }>
      <Button className="light">
        { children }
        { currentOption && currentOption.name ? currentOption.name : 'none' }
        <MdExpandMore style={ { marginLeft: '5px' } } size={ 20 } />
      </Button>
      <div className="PopoverMenu">
        { options.map((option) => {

          const onClick = model
            ? () => dispatch(actions.change(model, option.value))
            : () => option.onClick()

          return (
            <a
              key={ option.value }
              onClick={ onClick }
              className={ classNames({ 'active' : value === option.value }) }
            >
              { option.name }
            </a>
          )
        })}
      </div>
    </Popover>
  )
}

export default connect()(PopoverDropdown)
