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
import { MentionsInput, Mention } from 'stemn-frontend-shared/src/misc/Mentions/MentionsInput/index.js'
import UserAvatar from 'stemn-frontend-shared/src/misc/Avatar/UserAvatar/UserAvatar.jsx';
import AutosuggestHighlight from 'autosuggest-highlight';
import Checkbox from 'stemn-frontend-shared/src/misc/Input/Checkbox/Checkbox';

import getUuid from 'stemn-frontend-shared/src/utils/getUuid.js';
import http from 'axios';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      value: this.props.value,
    }
  },
  componentDidMount(){
    if(this.props.autoFocus){
      setTimeout(() => this.refs.input.refs.input.focus(), 1);
    }
  },
  componentWillReceiveProps(nextProps) {
    // Update the internal state if it differs from the redux state
    if(nextProps.value != this.state.value){
      this.setState({ value: nextProps.value })
    }
  },
  handleChange(event, value){
    this.setState({value: value});
    this.props.dispatch(actions.change(this.props.model, value));
  },
  displayTransform: function(id, display, type) {
    const name = display.split('[')[1].split(']')[0]; // Get the name (from between the square brackets)
    if(type == 'user'){
      return "@" + name
    }
    else if(type == 'task'){
      return `#${name}`
    }
    else if(type == 'task-complete'){
      return `#${name} (completed)`
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
      url: `/api/v1/search`,
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
        item.display = `[${item.name}](${item._id}`; // Create the display
      });
      callback(response.data)
    })
  },
  taskRenderSuggestion: (entry, search, highlightedDisplay, index) => {
    const matches = AutosuggestHighlight.match(entry.name, search);
    const parts   = AutosuggestHighlight.parse(entry.name, matches);
    return (
      <div className="layout-row layout-align-start-center">
        <Checkbox circle={true} />
        <div style={{marginLeft: '10px', marginBottom: '2px'}} className="flex">
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
    const { className, placeholder } = this.props;
    return (
      <MentionsInput
        ref="input"
        className={classNames(classes.editor, className)}
        placeholder={placeholder}
        value={this.state.value}
        displayTransform={this.displayTransform}
        markup="@__display__:__type__:__id__)" // format @[username](userName:mentionType:mentionId)
        onChange={this.handleChange}>
        <Mention
          trigger="@"
          type="user"
          data={this.userData}
          renderSuggestion={this.userRenderSuggestion}
          style={{background: 'rgba(68, 154, 211, 0.6)'}}
        />
        <Mention
          trigger="#"
          type="task"
          data={this.userData}
          renderSuggestion={this.taskRenderSuggestion}
          style={{background: 'rgba(68, 211, 95, 0.3)'}}
        />
        <Mention
          trigger="#"
          type="task-complete"
          data={this.userData}
          renderSuggestion={this.taskRenderSuggestion}
          style={{background: 'rgba(68, 211, 95, 0.3)'}}
        />
      </MentionsInput>
    )
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

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
