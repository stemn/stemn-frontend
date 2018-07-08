import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './LabelDisplay.css'
import cn from 'classnames'

export default class LabelDisplay extends Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,  // The labels
  }
  render() {
    const { labels } = this.props
    return (
      <div>
        { labels.map(label => (
          <div key={ label._id } className={ cn(classes.row, 'layout-row layout-align-start-center') }>
            <div
              className={ classes.swatch }
              style={ { background: label.color } }
            />
            { label.name }
          </div>
        ))}
      </div>
    )
  }
}

