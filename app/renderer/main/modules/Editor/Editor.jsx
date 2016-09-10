// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

// Container Actions
import * as editorActions from './Editor.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Editor.css';

// Sub Components
import { MentionsInput, Mention } from 'react-mentions'
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import AutosuggestHighlight from 'autosuggest-highlight';

import http from 'axios';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  handleChange(event, newValue, newPlainTextValue, mention){
//    this.props.changesActions.descriptionChange({projectId: this.props.project._id, value: newValue})
    this.props.dispatch(actions.change(this.props.model, newValue));
  },
  displayTransform: function(id, display) {
    return "@" + display
  },
  renderUserSuggestion: (entry, search, highlightedDisplay, index) => {
    const matches = AutosuggestHighlight.match(entry.name, search);
    const parts   = AutosuggestHighlight.parse(entry.name, matches);
    return (
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={entry.picture}/>
        <div style={{marginLeft: '10px'}} className="flex">
        {parts.map((part, index) => {
          const className = part.highlight ? 'text-primary' : null;
          return (
            <span className={className} key={index}>{part.text}</span>
          );
        })}
        </div>
      </div>
    );
  },
  render() {
    const data = (search, callback) => {
      return http({
        url: 'http://localhost:3000/api/v1/search',
        method: 'GET',
        params: {
          type:'user',
          key: 'name',
          value: search,
          size: 20,
          match: 'regex'
        },
      }).then( response => {
        response.data.forEach( item => { item.id = item._id; item.display = item.name}); // Add id to the object
        callback(response.data)
      })
    }
    return (
      <MentionsInput
        className={classes.editor}
        placeholder="Detailed Description"
        value={this.props.value}
        displayTransform={this.displayTransform}
        onChange={this.handleChange}>
        <Mention
        renderSuggestion={this.renderUserSuggestion}
        data={ data }
        style={{background: 'rgba(68, 183, 211, 0.3)'}} />
      </MentionsInput>
    )
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({}) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    EditorActions: bindActionCreators(editorActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
