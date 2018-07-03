import React from 'react'

import styles from './CompareFiles.css'

export default class CompareFiles extends React.Component {
  render() {
    return (
      <div className="layout-row">
        <div className="flex layout-column">{this.props.children[0]}</div>
        <div className={ `${styles.panelRight} flex layout-column` }>{this.props.children[1]}</div>
      </div>
    )
  }
}
