
import React from 'react'
import cn from 'classnames'
import classes from './MarkdownButton.css'
import Markdown from 'stemn-shared/assets/icons/editor/markdown.js'

export default class MarkdownButton extends React.Component {
  render() {
    const { children, style, className } = this.props
    return (
      <a
        href="https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet"
        target="_blank"
        className={ cn(className, classes.button) }
        style={ style }
      >
        <Markdown size="25" />
        { children
          ? <span style={ { paddingLeft: '5px' } }>{ children }</span>
          : null }
      </a>
    )
  }
}
