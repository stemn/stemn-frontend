import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import LoadingLinear from 'stemn-shared/misc/Loading/LoadingLinear/LoadingLinear'
import classes from './Autosuggest.module.css'

export default class AutosuggestWrapped extends Component {
  onChange = (event, { newValue }) => {
    if (typeof newValue === 'string') {
      this.props.updateInputValue(newValue)
      const value = newValue.trim()
      if (value === '') {
        this.props.clearSuggestions()
      }
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 0) {
      this.props.loadSuggestions({
        value,
        entityType: this.props.entityType,
      })
    }
  }

  renderSuggestion = (suggestion, { query }) => {
    if (suggestion.noResult) {
      return this.props.renderNoResult ? this.props.renderNoResult(suggestion, { query }) : <div>No Result</div>
    }
    return this.props.renderResult(suggestion, { query })
  }

  // This isnt used but is required by the lib
  getSuggestionValue = () => (suggestion) => suggestion.name

  onSuggestionSelected = (event, { suggestion }) => {
    // If the suggestion is the noResult placeholder...
    if (suggestion.noResult) {
      this.props.clickNoResult(suggestion)
      this.props.clearSuggestions()
      this.props.updateInputValue('')
      // Else, if it is a normal result
    } else {
      this.props.clearSuggestions()
      if (!this.props.setValue) {
        this.props.updateInputValue('')
      } else {
        this.props.updateInputValue(suggestion.name)
      }
      this.props.clickResult(suggestion)
    }
  }

  render() {
    const { value, suggestions, placeholder, clearSuggestions, isLoading } = this.props

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
    }

    // If withNoResult is true, we add a fake suggestion to the list
    // renderSuggestion should then be used to check for suggestion.noResult
    // and render a different template.
    const allSuggestions =
      suggestions && suggestions.length === 0 && !isLoading
        ? [
            {
              noResult: true,
              query: value,
            },
          ]
        : suggestions

    return (
      <div className={classes.container}>
        <Autosuggest
          suggestions={allSuggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={clearSuggestions}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
        {isLoading && <LoadingLinear className={classes.loadbar} />}
      </div>
    )
  }
}
