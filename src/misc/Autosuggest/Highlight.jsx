import React, { Component, PropTypes } from 'react';

import AutosuggestHighlight from 'autosuggest-highlight';

export default class Highlight extends Component {
  static propTypes = {
    // The text to highlight
    text: PropTypes.string.isRequired,
    // The query
    query: PropTypes.string.isRequired,
    // The class to be applied to the highlighted section
    hightlightClass: PropTypes.string.isRequired,
  }
  
  render() {
    const { text, query, hightlightClass } = this.props;
    const matches = AutosuggestHighlight.match(text, query);
    const parts = AutosuggestHighlight.parse(text, matches);
    
    return (
      <span>
        { parts.map((part, index) => {
            const className = part.highlight ? hightlightClass : null;
            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    );
  }
}
