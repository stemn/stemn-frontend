import React from 'react'
import cn from 'classnames'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import Popover from 'stemn-shared/misc/Popover'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import Input from 'stemn-shared/misc/Input/Input/Input'

import classes from './ThreadGroup.css'
export default class ThreadGroup extends React.Component {
  render() {
    const { item, children, layout, entityModel, deleteGroup, updateGroup, simpleGroup } = this.props

    const headerClasses = cn(classes.header, layout === 'list' ? classes.headerList : classes.headerBoard, 'layout-row layout-align-start-center')
    
    if (simpleGroup) {
      return (
        <div className={ layout === 'list' ? classes.wrapperList : classes.wrapperBoard }>
          <div className={ headerClasses } />
          <div className={ layout === 'list' ? classes.contentList : classes.contentBoard }>
            {children}
          </div>
        </div>
      )
    }
    
    return (
      <div className={ layout === 'list' ? classes.wrapperList : `${classes.wrapperBoard} layout-column` }>
        <div className={ headerClasses }>
          <h3 className="flex">
            <Input 
              model={ `${entityModel}.name` }
              value={ item.name }
              placeholder="Group name" 
              className="input-plain text-mini-caps" 
              type="text" 
              changeAction={ () => { setTimeout(updateGroup, 1) } } 
            />
          </h3>
          <div className={ classes.options }>
            <Popover preferPlace="below">
              <SimpleIconButton>
                <MdMoreHoriz size="20px" />
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a onClick={ deleteGroup }>Delete Group</a>
              </div>
            </Popover>
          </div>
        </div>
        <div className={ layout === 'list' ? classes.contentList : classes.contentBoard }>
          {children}
        </div>
      </div>
    )
  }
}
