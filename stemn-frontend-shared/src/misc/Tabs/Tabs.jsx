import React from 'react'

import tabClasses from './Tabs.module.css'

import cn from 'classnames'

const Tabs = (props) => {
  const rootClasses = cn(tabClasses.tabs, { 
    [tabClasses.tabsLg]: props.size === 'lg',
    [tabClasses.noLine]: props.noline,
  }, props.className)
  const innerClasses = cn('tabs-inner', 'layout-row', tabClasses.inner)
  
  return (
    <div className={ rootClasses } style={ props.style }>
      <div className={ innerClasses }>
        { props.children }
      </div>
    </div>
  )
}

export default Tabs
