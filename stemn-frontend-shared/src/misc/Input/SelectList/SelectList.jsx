import React from 'react'
import MdDone from 'react-icons/md/done'
// Styles
import cn from 'classnames'
import styles from './SelectList.css'

export default class SelectList extends React.Component {
  render() {
    const id = Math.random().toString(36).substring(7)
    return (
      <div className={ styles.selectList }>
        {this.props.children.map(child =>
          <div className={ cn(styles.selectItem, 'layout-row layout-align-start-center', { [styles.selectItemActive]: child.props.value === this.props.value }) }>
            <div className="flex">{child}</div>
            <div className={ styles.selectIcon }><MdDone size="16" /></div>
          </div>,
        )}
      </div>
    )
  }
}
