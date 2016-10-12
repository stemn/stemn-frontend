import React from 'react';
import { connect } from 'react-redux';
import { validateMention } from 'app/renderer/main/modules/Mentions/Mentions.utils.js';

// Container Actions
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

const TaskMention = React.createClass({
  showModal(){
    this.props.dispatch(ModalActions.showModal({
      modalType: 'TASK',
      modalProps: {
        taskId: this.props.entityId
      }
    }))
  },
  render() {
    const { entityId, mentionId, mentionType, children, className} = this.props;
    return (
      <a id={mentionId}
        className={className}
        href={mentionType == 'user' ? `/users/${entityId}` : `/tasks/${entityId}`}
        onClick={this.showModal}>
        {children}
      </a>
    )
  }
});
const TaskMentionConnected = connect()(TaskMention);


function markdownitLinkAttributes (md, config) {
  config = config || {}
  config.mentionClass = config.mentionClass || 'mention';

  var textRenderer = md.renderer.rules.text || this.defaultRender;
  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    const token1 = tokens[idx];
    const token2 = tokens[idx+1];
    const token3 = tokens[idx+2];
    const href   = token2 && token2.type == 'link_open' ? getAttribute(token2, 'href') : '';
    const isValidMention = token1.content.endsWith('@') && validateMention(href) && token3;

    // If we have the '@' trigger at the end of the string
    if(isValidMention){
      // Remove the trigger
      token1.content = token1.content.slice(0, -1);
      // Create the mention link
      const [ entityId, mentionType, mentionId ] = href.split(':');
      const trigger = mentionType == 'user' ? '@' : '#';
      tokens[idx + 1] = (
        <TaskMentionConnected
          entityId={entityId}
          mentionId={mentionId}
          mentionType={mentionType}
          className={config.mentionClass}>
          {trigger.concat(token3.content)}
        </TaskMentionConnected>
      )
      tokens.splice(idx + 2, 1);
    }
    return textRenderer(tokens, idx, options, env, self)
  }
}


markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
export default markdownitLinkAttributes

/////////////////////////////////////////

function getAttribute(token, attr){
  var aIndex = token.attrIndex(attr);
  return aIndex < 0 ? '' : token.attrs[aIndex][1];
}

function writeAttribute(token, attr, value){
  var aIndex = token.attrIndex(attr);
  if (aIndex < 0) { // attr doesn't exist, add new attribute
    token.attrPush([attr, value])
  } else { // attr already exists, overwrite it
    token.attrs[aIndex][1] = value
  }
}
