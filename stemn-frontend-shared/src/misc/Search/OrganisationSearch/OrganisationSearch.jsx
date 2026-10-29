import React, { Component } from 'react'
import classes from './OrganisationSearch.module.css'

import Autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.container'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'

export default class OrganisationSearch extends Component {
  getSuggestionValue = () => (suggestion) => suggestion.name

  renderResult = (suggestion, { query }) => (
    <div className="layout-row layout-align-start-center">
      <div style={{ marginLeft: '10px' }} className="flex">
        <Highlight text={suggestion.name} query={query} hightlightClass={classes.highlight} />
      </div>
    </div>
  )

  render() {
    const { select, cacheKey } = this.props

    return (
      <Autosuggest
        cacheKey={`org-search-${cacheKey}`}
        placeholder="Search and organisations"
        clickResult={select}
        renderResult={this.renderResult}
        getSuggestionValue={this.getSuggestionValue}
        entityType="organisation"
      />
    )
  }
}
