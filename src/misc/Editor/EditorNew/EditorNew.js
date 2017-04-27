import React, { Component, PropTypes } from 'react'
import CodeMirror from 'react-codemirror'
import classes from './EditorNew.css'
import 'codemirror/mode/markdown/markdown'
import { replaceMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
import MentionPopover from 'stemn-shared/misc/Search/MentionPopover'
import getUuid from 'stemn-shared/utils/getUuid'
import { getMentionString, parseMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
import splice from 'stemn-shared/utils/strings/splice'
import EditorToolbar from 'stemn-shared/misc/Editor/EditorToolbar'

// Codemirror options
const options = {
  lineNumbers: false,
  mode: 'markdown',
  dragDrop: false,
  lineWrapping: true,
}

export default class EditorNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      caretPosition: {
        top: 0,
        left: 0,
      },
      caretRange: {
        start: 0,
        end: 0,
      },
      query: '',
      showPopover: false,
    }
  }
  updateValue = (newValue) => {
    const { model, change, value } = this.props
    this.checkForMentions()
    change(model, newValue)
  }
  codemirror = null
  getCodeMirrorRef = (ref) => {
    if (ref) {
      this.codemirror = ref.getCodeMirror()
    }
  }
  checkForMentions = () => {
    const from = { line: 0, ch: 0, }
    const to = this.codemirror.getCursor()
    // Get the content up to the cursor
    const valueUpToCursor = this.codemirror.getRange(from, to)
    // Get the word just before the cursor
    const wordsSplit = valueUpToCursor.split(' ')
    const lastWord = wordsSplit[wordsSplit.length - 1]
    // If it starts with @, we have a mention
    if (lastWord.startsWith('@')) {
      const caretEl = document.getElementsByClassName('CodeMirror-cursor')[0]
      const caretPosition = caretEl.getBoundingClientRect()
      this.setState({
        caretPosition: {
          left: caretPosition.left,
          top: caretPosition.top,
        },
        caretRange: {
          start: valueUpToCursor.length - lastWord.length,
          end: valueUpToCursor.length,
        },
        query: lastWord.substring(1),
        showPopover: true,
      })
    } else {
       this.setState({
         showPopover: false,
       })
    }
  }
  addMention = (result) => {
    // Create the mention object
    const mention = {
      display: result.name,
      entityId: result._id,
      mentionType: 'user',
      mentionId: getUuid(),
    }
    // Insert text at caret
    this.insertAtCaret(`${getMentionString(mention)} `)
    // Hide the mention popover
    this.setState({
      showPopover: false,
    })
  }
  insertAtCaret = (textToInsert) => {
    const { value, model, change } = this.props
    const { caretRange } = this.state
    const newValue = splice(value, caretRange.start, caretRange.end - caretRange.start, textToInsert)
    // Update to include the mention string
    change(model, newValue)
  }
  cursorInsert = (text) => {
    const cursorRange = {
      from: this.codemirror.getCursor('from'),
      to: this.codemirror.getCursor('to'),
    }
    this.codemirror.replaceRange(text, cursorRange.from, cursorRange.to);
  }
  cursorWrap = (contentFunction) => {
    const cursorRange = {
      from: this.codemirror.getCursor('from'),
      to: this.codemirror.getCursor('to'),
    }
    const content = this.codemirror.getRange(cursorRange.from, cursorRange.to)
    this.codemirror.replaceRange(contentFunction(content), cursorRange.from, cursorRange.to);
  }
  upload = () => {
    this.props.showUploadModal().then(({ value }) => {
      this.cursorWrap((content) => `\n ![${ content || 'alt text' }](${ value.url })`)
    })
  }
  bold = () => {
    this.cursorWrap((content) => `**${content}**`)
  }
  heading = () => {
    this.cursorWrap((content) => `# ${content}`)
  }
  italic = () => {
    this.cursorWrap((content) => `_${content}_`)
  }
  bullet = () => {
    this.cursorWrap((content) => `\n* ${content}`)
  }
  link = () => {
    this.cursorWrap((content) => `[${ content || 'text' }](url)`)
  }
  render() {
    const { value, showUploadModal, hideToolbar } = this.props
    const { caretPosition, query, showPopover } = this.state

    return (
      <div>
        <EditorToolbar
          codemirror={ this.codemirror }
          hide={ hideToolbar }
        />
        <CodeMirror
          ref={ this.getCodeMirrorRef }
          className={ classes.editor }
          value={ value }
          onChange={ this.updateValue }
          options={ options }
        />
        <MentionPopover
          caretPosition={ caretPosition }
          addMention={ this.addMention }
          showPopover={  showPopover }
          query={ query }
          entityType="user"
        />
      </div>
    )
  }
}


//import React, { Component, PropTypes } from 'react'
//import CodeMirror from 'react-codemirror'
//import classes from './EditorNew.css'
//import 'codemirror/mode/markdown/markdown'
//import { replaceMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
//import MentionPopover from 'stemn-shared/misc/Search/MentionPopover'
//import getUuid from 'stemn-shared/utils/getUuid'
//import { getMentionString, parseMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
//import splice from 'stemn-shared/utils/strings/splice'
//
//// Codemirror options
//const options = {
//  lineNumbers: false,
//  mode: 'markdown',
//  dragDrop: false,
//  lineWrapping: true,
//}
//
//export default class EditorNew extends Component {
//  constructor(props) {
//    super(props)
//    this.state = {
//      caret: {
//        position: left
//      },
//      query: '',
//      showPopover: false,
//    }
//  }
//  updateValue = (newValue) => {
//    const { model, change, value } = this.props
//    const caret = this.getCaret()
//    this.checkForMentions()
//    change(model, newValue)
//  }
//  codeMirror = null
//  getCodeMirrorRef = (ref) => {
//    if (ref) {
//      this.codeMirror = ref.getCodeMirror()
//    }
//  }
//  getCaret = () => {
//    const from = { line: 0, ch: 0, }
//    const to = this.codeMirror.getCursor()
//    // Get the content up to the cursor
//    const valueUpToCursor = this.codeMirror.getRange(from, to)
//    // Get the word just before the cursor
//    const wordsSplit = valueUpToCursor.split(' ')
//    const lastWord = wordsSplit[wordsSplit.length - 1]
//    // Get the caret position
//    const caretEl = document.getElementsByClassName('CodeMirror-cursor')[0]
//    const caretPosition = caretEl.getBoundingClientRect()
//    return {
//      position: {
//        left: caretPosition.left,
//        top: caretPosition.top,
//      },
//      index: valueUpToCursor.length,
//      lastWord,
//    }
//  }
//  checkForMentions = () => {
//    // If it starts with @, we have a mention
//    if (lastWord.startsWith('@')) {
//      const caretEl = document.getElementsByClassName('CodeMirror-cursor')[0]
//      const caretPosition = caretEl.getBoundingClientRect()
//      this.setState({
//        caretPosition: {
//          left: caretPosition.left,
//          top: caretPosition.top,
//        },
//        caretRange: {
//          start: valueUpToCursor.length - lastWord.length,
//          end: valueUpToCursor.length,
//        },
//        query: lastWord.substring(1),
//        showPopover: true,
//      })
//    } else {
//       this.setState({
//         showPopover: false,
//       })
//    }
//  }
//  addMention = (result) => {
//    // Create the mention object
//    const mention = {
//      display: result.name,
//      entityId: result._id,
//      mentionType: 'user',
//      mentionId: getUuid(),
//    }
//    // Insert text at caret
//    this.insertAtCaret(`${getMentionString(mention)} `)
//    // Hide the mention popover
//    this.setState({
//      showPopover: false,
//    })
//  }
//  insertAtCaret = (textToInsert) => {
//    const { value, model, change } = this.props
//    const { caretRange } = this.state
//    const newValue = splice(value, caretRange.start, caretRange.end - caretRange.start, textToInsert)
//    // Update to include the mention string
//    change(model, newValue)
//  }
//  insert = () => {
//    this.insertAtCaret('test')
//  }
//  render() {
//    const { value } = this.props
//    const { caretPosition, query, showPopover } = this.state
//
//    return (
//      <div>
//        <button onClick={ this.insert }>
//          Insert
//        </button>
//        <CodeMirror
//          ref={ this.getCodeMirrorRef }
//          className={ classes.editor }
//          value={ value }
//          onChange={ this.updateValue }
//          options={ options }
//        />
//        <MentionPopover
//          caretPosition={ caretPosition }
//          addMention={ this.addMention }
//          showPopover={  showPopover }
//          query={ query }
//          entityType="user"
//        />
//      </div>
//    )
//  }
//}

