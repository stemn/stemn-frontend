
import React from 'react';
import classNames from 'classnames';
import classes from './MarkdownButton.css';
import Markdown from 'app/renderer/assets/icons/editor/markdown.js';

export default React.createClass({  
  render() {
    const { children, style } = this.props;
    return (
      <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet" className={classes.button} style={style}>
        <Markdown size="25"/>
        { children
        ? <span style={{paddingLeft: '5px'}}>{children}</span>
        : null }
      </a>
    );
  }
});
