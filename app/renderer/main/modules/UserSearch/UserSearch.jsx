import React from 'react';
import Autosuggest from 'react-autosuggest';
import 'app/renderer/assets/css/autosuggest.css';

export default React.createClass({
  onChange(event, { newValue }) {
    this.props.UserSearchActions.updateInputValue(newValue)
    const value = newValue.trim();
    if (value === '') {
      this.props.UserSearchActions.clearSuggestions();
    }
  },

  onSuggestionsUpdateRequested({ value }) {
    this.props.UserSearchActions.loadSuggestions(value);
  },

  getSuggestionValue(suggestion) {
    return suggestion.name;
  },

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.name}</span>
    );
  },

  render() {
    console.log(this.props);
    const inputProps = {
      placeholder: "Type 'c'",
      value: this.props.userSearch.value,
      onChange: this.onChange
    };
    const status = (this.props.userSearch.isLoading ? 'Loading...' : 'Type to load suggestions');

    return (
      <div className="app-container">
        <Autosuggest
          suggestions={this.props.userSearch.suggestions}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
        <div className="status">
          <strong>Status:</strong> {status}
        </div>
      </div>
    );
  }
})
