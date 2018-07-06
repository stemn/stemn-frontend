import React from 'react'
import classes from './TimelineWrapper.scss'
import { some } from 'lodash'

export default class TimelineWrapper extends React.Component {
  render() {
    return (
      <div className={ classes.item } style={ this.props.style }>
        <div className="layout-row layout-align-start-center">
          <div className={ classes.marker } />
          <div className="layout-column">
            { this.props.children[0] }
          </div>
        </div>
        { this.props.children[1] && this.props.children[1].props.children && some(this.props.children[1].props.children) &&
          <div className={ classes.extra }>
            { this.props.children[1] }
          </div>
        }
      </div>
    )
  }
}
