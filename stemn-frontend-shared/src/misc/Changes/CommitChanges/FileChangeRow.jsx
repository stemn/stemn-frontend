import React from 'react'
import cn from 'classnames'
import capitalizeFirstLetter from 'stemn-shared/utils/strings/capitalizeFirstLetter'

// Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'

import Add from 'stemn-shared/assets/icons/changes/add.js'
import Remove from 'stemn-shared/assets/icons/changes/remove.js'
import Change from 'stemn-shared/assets/icons/changes/change.js'

// Styles
import styles from './FileChangeRow.css'

export default class FileChangeRow extends React.Component {
  render() {
    const {
      model,
      value,
      text,
      clickFn,
      isActive,
      status,
    } = this.props
    // status === 'created' || 'modified' || 'deleted'

    // Classes
    const rowClasses = cn({
      [styles.fileChangeRow]: true,
      [styles.active]: isActive,
      'layout-row': true,
      'layout-align-start-center': true,
    })

    const getIcon = (status) => {
      if (status === 'deleted') {
        return <Remove size={ 8 } />
      } else if (status === 'created') {
        return <Add size={ 8 } />
      }
      // modified
      return <Change size={ 8 } />
    }
    const getClass = (status) => {
      if (status === 'deleted') {
        return styles.deleted
      } else if (status === 'created') {
        return styles.created
      }
      // modified
      return styles.modified
    }

    // Template
    return (
      <div className={ rowClasses }>
        <div className={ styles.checkbox }>
          <Checkbox model={ model } value={ value } title={ value ? 'Deselect change' : 'Select change' } />
        </div>
        <div className={ `${styles.text} flex text-ellipsis layout-row` } onClick={ clickFn }>
          <div className="flex" title={ text }>{middleConcat(text, 60, 0.5)}</div>
        </div>
        <div className={ cn(styles.icon, getClass(status), 'layout-column layout-align-center-center') } title={ capitalizeFirstLetter(status) }>
          {getIcon(status)}
        </div>
      </div>
    )
  }
}
