import React                from 'react';
import markdownIt           from 'markdown-it';
import emoji                from 'markdown-it-emoji';
import mdMathjax            from 'markdown-it-mathjax';
import classes              from './EditorDisplay.css';
import { validateMention }  from 'electron/app/renderer/main/modules/Mentions/Mentions.utils.js';
import htmlToReact          from 'html-to-react';
import hljs                 from 'highlight.js';
import classNames           from 'classnames';
import { connect }          from 'react-redux';
import * as ModalActions    from 'electron/app/renderer/main/modules/Modal/Modal.actions.js';

const TaskMention = React.createClass({
  showModal(){
    this.props.dispatch(ModalActions.showModal({
      modalType: 'TASK',
      limit: 1,
      modalProps: {
        taskId: this.props.entityId
      }
    }))
  },
  render() {
    const { entityId, mentionId, mentionType, children} = this.props;
    return (
      <a id={mentionId}
        className={classes.mention}
        href={mentionType == 'user' ? `/users/${entityId}` : `/tasks/${entityId}`}
        onClick={this.showModal}>
        {children}
      </a>
    )
  }
});
const TaskMentionConnected = connect()(TaskMention);

/////////////////////////////////////////////////////////////////////////

const htmlToReactParser = new htmlToReact.Parser();

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});
md.use(emoji);
md.use(mdMathjax);

const processNodeDefinitions = new htmlToReact.ProcessNodeDefinitions(React);
const processingInstructions = [{
  // Remove the '@' trigger if the next element is a mention
  shouldProcessNode: function (node) {
    return node.type == 'text' && node.data.endsWith('@') && node.next && node.next.attribs && validateMention(node.next.attribs.href);
  },
  processNode: function (node, children, index) {
    return <span>{node.data.slice(0, -1)}</span>
  }
},{
  // Add the mention to replace the anchor
  shouldProcessNode: function (node) {
    return node.name == 'a' && validateMention(node.attribs.href);
  },
  processNode: function (node, children, index) {
    const [ entityId, mentionType, mentionId ] = node.attribs.href.split(':');
    const innerTextFn = {
      user           : (display) => '@' + display,
      task           : (display) => '#' + display + ' (related)',
      'task-complete': (display) => '#' + display + ' (complete)'
    }
    const innerText = innerTextFn[mentionType] ? innerTextFn[mentionType](node.children[0].data) : node.children[0].data;

    return (
      <TaskMentionConnected
        key={index}
        entityId={entityId}
        mentionId={mentionId}
        mentionType={mentionType}>
        {innerText}
      </TaskMentionConnected>
    )
  }
}, {
  shouldProcessNode: (node) => {
    return true;
  },
  processNode: processNodeDefinitions.processDefaultNode
}];

export default React.createClass({
  getMarkdownText() {
    var rawMarkup = '<div>' + md.render(this.props.value || '') + '</div>';
    return htmlToReactParser.parseWithInstructions(rawMarkup, () => true, processingInstructions);
  },
  render() {
    const { value, onClick } = this.props;
    return (
      <div onClick={onClick}>
        <div className={classes.display}>{this.getMarkdownText(value)}</div>
      </div>
    )
  }
});
