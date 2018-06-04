import React from 'react'

// Styles
import styles from './ContentSidebar.css'
import DragResize      from 'stemn-shared/misc/DragResize/DragResize.jsx'

const Sidebar = props => (
  <DragResize side="right" width="450" widthRange={ [0, 1000] } className="layout-column flex">
    <aside className={ `${styles.contentSidebar} layout-column flex` }>
      { props.children }
    </aside>
  </DragResize>
)

export default Sidebar
