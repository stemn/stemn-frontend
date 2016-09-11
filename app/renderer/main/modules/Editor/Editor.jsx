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

import getUuid from 'app/shared/helpers/getUuid.js';
import http from 'axios';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  handleChange(event, newValue, newPlainTextValue, mention){
    this.props.dispatch(actions.change(this.props.model, newValue));
  },
  displayTransform: function(id, display, type) {
    const displaySplit = display.split(':');
    const name = displaySplit[1];
    if(type == 'user'){
      return "@" + name
    }
    else{
      return "#" + name
    }
  },
  userRenderSuggestion: (entry, search, highlightedDisplay, index) => {
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
  userData(search, callback) {
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
      response.data.forEach( item => {
        item.id = getUuid(); // Get a random mention id
        item.display = `${item._id}:${item.name}`; // Create the display
      });
      callback(response.data)
    })
  },
  render() {

    return (
      <MentionsInput
        className={classes.editor}
        placeholder="Detailed Description"
        value={this.props.value}
        displayTransform={this.displayTransform}
        markup="@[__type__:__display__](__id__)" // format @[user:userId-userName](mentionId)
        onChange={this.handleChange}>
        <Mention
          trigger="@"
          type="user"
          data={this.userData}
          renderSuggestion={this.userRenderSuggestion}
          style={{background: 'rgba(68, 183, 211, 0.3)'}}
        />
        <Mention
          trigger="#"
          type="task"
          data={this.userData}
          renderSuggestion={this.userRenderSuggestion}
          style={{background: 'rgba(68, 183, 211, 0.3)'}}
        />
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
