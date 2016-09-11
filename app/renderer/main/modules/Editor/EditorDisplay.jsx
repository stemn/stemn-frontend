// Component Core
import React from 'react';
import markdownIt from 'markdown-it';
import classes from './EditorDisplay.css';

import mdMentions from './plugins/mentions.js';

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(mdMentions, {
  mentionClass: classes.mention,
});

// Styles
import classNames from 'classnames';

// Sub Components

export default React.createClass({
  getMarkdownText() {
    var rawMarkup = md.render(this.props.value);
    return { __html: rawMarkup };
  },
  render() {
    const { value, onClick } = this.props;
    return (
      <div onClick={onClick}>
        <div className={classes.display} dangerouslySetInnerHTML={this.getMarkdownText()} />
      </div>
    )
  }
});
