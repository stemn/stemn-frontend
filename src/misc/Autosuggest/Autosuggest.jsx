import React, { Component, PropTypes } from 'react'
import Autosuggest from 'react-autosuggest'
import Highlight from './Highlight'
import LoadingLinear from 'stemn-shared/misc/Loading/LoadingLinear/LoadingLinear'
import classes from './Autosuggest.css'

export default class AutosuggestWrapped extends Component {
  static propTypes = {
    // Key used to to link this to the store
    // This is done in the container
    cacheKey: PropTypes.string.isRequired,
    // The placeholder
    placeholder: PropTypes.string,
    // Entity type used in API search query
    entityType: PropTypes.string.isRequired,
    // The current text in the autosuggest
    value: PropTypes.string.isRequired,
    // Array of suggestions
    suggestions: PropTypes.array.isRequired,
    // Is the autosuggest loading?
    isLoading: PropTypes.bool.isRequired,
    // Should we set the value when we click it (default is to clear)
    setValue: PropTypes.bool,
    // Function to update the input
    updateInputValue: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    loadSuggestions: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
  }
    
  onChange = (event, { newValue }) => {
    if ( typeof newValue === 'string') {
      this.props.updateInputValue(newValue)
      const value = newValue.trim();
      if (value === '') {
        this.props.clearSuggestions();
      }
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    if(value.length > 0){
      this.props.loadSuggestions({
        value,
        entityType: this.props.entityType,
      });
    }
  }
  
  // This isnt used but is required by the lib
  getSuggestionValue = () => suggestion => suggestion.name

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.clearSuggestions();
    if (!this.props.setValue) {
      this.props.updateInputValue('')
    } else {
      this.props.updateInputValue(suggestion.name)
    }
    this.props.select(suggestion);
  }

  render() {
    const { value, suggestions, placeholder, clearSuggestions, renderSuggestion, isLoading } = this.props;
    
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };
    
    return (
      <div className={ classes.container }>
        <Autosuggest
          suggestions={ suggestions }
          onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
          onSuggestionsClearRequested={ clearSuggestions }
          getSuggestionValue={ this.getSuggestionValue }
          renderSuggestion={ renderSuggestion }
          onSuggestionSelected={ this.onSuggestionSelected }
          inputProps={ inputProps }
        />
        { isLoading && <LoadingLinear className={ classes.loadbar } /> }
      </div>
    );
  }
}
