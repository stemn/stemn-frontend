import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from  'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import classes from './LocationSearch.css'

import Autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.container'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'

@connect()
export default class LocationSearch extends Component {
  static propTypes = {
    select: PropTypes.func,
    cacheKey: PropTypes.string.isRequired,
    model: PropTypes.string,
    value: PropTypes.object,
  }

  select = (value) => {
    // If we pass in a select function, we use it.
    // Otherwise, we use the model
    const { select, model, dispatch } = this.props
    if (select) {
      select(value)
    } else {
      dispatch(storeChange(model, value))
    }
  }

  renderResult = (suggestion, { query }) => (
    <div className="layout-row layout-align-start-center">
      <div style={ { marginLeft: '10px' } } className="flex">
        <Highlight text={ suggestion.name } query={ query } hightlightClass={ classes.highlight } />
      </div>
    </div>
  )

  render() {
    const { value, cacheKey } = this.props

    return (
      <Autosuggest
        initialValue={ value ? value.name : '' }
        cacheKey={ `location-search-${cacheKey}` }
        clickResult={ this.select }
        renderResult={ this.renderResult }
        entityType="location"
        setValue
      />
    )
  }
}
