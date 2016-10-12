// Component Core
import React from 'react';
import markdownIt from 'markdown-it';
import classes from './EditorDisplay.css';

import mdMentions from './plugins/mentions.js';
import mdReact from './plugins/mdReact.jsx';

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(mdMentions, {
  mentionClass: classes.mention,
}).use(mdReact);

// Styles
import classNames from 'classnames';



// Sub Components
//export default React.createClass({
//  getMarkdownText() {
//    var rawMarkup = md.render(this.props.value);
//    return { __html: rawMarkup };
//  },
//  render() {
//    const { value, onClick } = this.props;
//    setTimeout(()=>{
//      const anchors = this.refs.content.getElementsByTagName('a');
//      anchors[0].innerHTML = 'asfafsasfafsfasfas';
//      console.log(anchors[0]);
//    }, 100)
//    return (
//      <div onClick={onClick}>
//        <div ref="content" className={classes.display} dangerouslySetInnerHTML={this.getMarkdownText()} />
//      </div>
//    )
//  }
//});

export default React.createClass({
  getMarkdownText() {
    var rawMarkup = md.render(this.props.value);
    return { __html: rawMarkup };
  },
  render() {
    const { value, onClick } = this.props;
    return (
      <div onClick={onClick}>
        <div className={classes.display}>{md.renderTokens(this.props.value)}</div>
      </div>
    )
  }
});
