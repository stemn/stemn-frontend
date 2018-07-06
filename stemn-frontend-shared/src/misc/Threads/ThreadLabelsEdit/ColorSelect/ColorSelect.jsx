// Component Core
import React from 'react'
import { connect } from 'react-redux'

import classes from './ColorSelect.css'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'


class Component extends React.Component {
  render() {
    const {
      dispatch,
      model,
    } = this.props

    const niceColors = [
      '#001F3F',
      '#0074D9',
      '#7FDBFF',
      '#39CCCC',
      '#3D9970',
      '#2ECC40',
      '#01FF70',
      '#FFDC00',
      '#FF851B',
      '#FF4136',
      '#F012BE',
      '#B10DC9',
      '#85144B',
      '#FFFFFF',
      '#DDDDDD',
      '#AAAAAA',
    ]

    return (
      <div className={ `${classes.sampleOuter} layout-row layout-wrap` }>
        {
          niceColors.map(color =>
            <div
              key={ color }
              onClick={ () => dispatch(storeChange(model, color)) }
              className={ classes.sampleSwatch }
              style={ { background: color } }
            />,
          )
        }
      </div>
    )
  }
}

export default connect()(Component)
