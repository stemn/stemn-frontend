import React, { Component } from 'react'
import markdownIt from 'markdown-it'
import pluginEmoji from 'markdown-it-emoji'
import pluginKatex from 'markdown-it-katex'
import classes from './EditorDisplay.css'
import { validateMention } from 'stemn-shared/misc/Mentions/Mentions.utils.js'
import MentionFromString from 'stemn-shared/misc/Mentions/MentionFromString'
import htmlToReact from 'html-to-react'

const htmlToReactParser = new htmlToReact.Parser()

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
//  highlight: function (str, lang) {
//    if (lang && hljs.getLanguage(lang)) {
//      try {
//        return hljs.highlight(lang, str).value;
//      } catch (__) {}
//    }
//    return ''; // use external default escaping
//  }
})
md.use(pluginEmoji)
md.use(pluginKatex)

const processingInstructions = [{
  // Add the mention to replace the anchor
  shouldProcessNode: node => node.name === 'a' && validateMention(node.attribs.href),
  processNode: (node, children) => (
    <MentionFromString
      href={ node.attribs.href }
      display={ node.children[0].data }
    />
  ),
}, {
  shouldProcessNode: node => true,
  processNode: new htmlToReact.ProcessNodeDefinitions(React).processDefaultNode,
}]

export default class EditorDisplay extends Component {
  getMarkdownText() {
    const rawMarkup = `<div>${md.render(this.props.value || '')}</div>`
    return htmlToReactParser.parseWithInstructions(rawMarkup, () => true, processingInstructions)
  }
  render() {
    const { value, onClick } = this.props
    return (
      <div onClick={ onClick }>
        <div className={ classes.display }>{this.getMarkdownText(value)}</div>
      </div>
    )
  }
}
