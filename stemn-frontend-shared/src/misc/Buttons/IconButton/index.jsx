import React from 'react'

// Styles
import styles from './IconButton.css'

export default props => 
  // Template
  (
    <div onClick={ props.onClick } className={ `${styles.buttonWrapper} layout-row layout-align-start-center` }>
      <button className={ styles.iconButton }>
        {props.children[0]}
      </button>
      <label className={ styles.label }>{props.children[1]}</label>
    </div>
  )

