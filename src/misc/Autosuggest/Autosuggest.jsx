import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import Highlight from './Highlight';

export default class AutosuggestWrapped extends Component {
  static propTypes = {
    // Key used to to link this to the store
    // This is done in the container
    cacheKey: PropTypes.string.isRequired,
    // The placeholder
    placeholder: PropTypes.string.isRequired,
    // Entity type used in API search query
    entityType: PropTypes.string.isRequired,
    // The current text in the autosuggest
    value: PropTypes.string.isRequired,
    // Array of suggestions
    suggestions: PropTypes.array.isRequired,
    // Is the autosuggest loading?
    isLoading: PropTypes.bool.isRequired,
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
  
  getSuggestionValue = () => suggestion => suggestion.name


  onSuggestionSelected = (event, { suggestion }) => {
    this.props.clearSuggestions();
    this.props.updateInputValue('')
    this.props.select(suggestion);
  }

  render() {
    const { value, suggestions, placeholder, clearSuggestions, renderSuggestion } = this.props;
    
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };
    
    return (
      <Autosuggest
        suggestions={ suggestions }
        onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
        onSuggestionsClearRequested={ clearSuggestions }
        getSuggestionValue={ this.getSuggestionValue }
        renderSuggestion={ renderSuggestion }
        onSuggestionSelected={ this.onSuggestionSelected }
        inputProps={ inputProps } />
    );
  }
}
