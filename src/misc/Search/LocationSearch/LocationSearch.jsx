import React, { Component, PropTypes } from 'react';

import classes from './LocationSearch.css';

import Autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.container';
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight';

export default class LocationSearch extends Component {
  static propTypes = {
    select: PropTypes.func,
    cacheKey: PropTypes.string.isRequired,
    model: PropTypes.string,
    value: PropTypes.object,
  }

  renderSuggestion = (suggestion, { query }) => {
    return (
      <div className="layout-row layout-align-start-center">
        <div style={ { marginLeft: '10px' } } className="flex">
          <Highlight text={ suggestion.name } query={ query } hightlightClass={ classes.highlight }/>
        </div>
      </div>
    );
  }

  render() {
    const { select, value, cacheKey } = this.props;

    return (
      <Autosuggest
        value={ value }
        cacheKey={ `location-search-${cacheKey}` }
        select={ select }
        renderSuggestion={ this.renderSuggestion }
        entityType="location"
      />
    );
  }
}
