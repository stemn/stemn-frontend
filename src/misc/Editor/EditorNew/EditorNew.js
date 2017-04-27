import React, { Component, PropTypes } from 'react'
import CodeMirror from 'react-codemirror'
import classes from './EditorNew.css'
import 'codemirror/mode/markdown/markdown'
import { replaceMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
import MentionPopover from 'stemn-shared/misc/Search/MentionPopover'
import getUuid from 'stemn-shared/utils/getUuid'
import { parseMentions, getMentionString } from 'stemn-shared/misc/Mentions/Mentions.utils'
import splice from 'stemn-shared/utils/strings/splice'
import EditorToolbar from 'stemn-shared/misc/Editor/EditorToolbar'

// The will split at new line
const getValueInLineFormat = (value = '') => value.split('\n')

// The will find all the mentions and return them in line/ch format
const findAllMentionsPositions = (value = '') => {
  const valueInLineFormat = getValueInLineFormat(value)
  const mentionsInEachLine = valueInLineFormat.map(parseMentions)
  const allMentions = []
  mentionsInEachLine.forEach((mentions, index) => {
    mentions.forEach(mention => allMentions.push({
      from: {
        line: index,
        ch: mention.index.from,
      },
      to: {
        line: index,
        ch: mention.index.to,
      }
    }))
  })
  return allMentions
}

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
  convertMentions = () => {
    // Get the position of all the valid mentions
    const mentionPositions = findAllMentionsPositions(this.props.value)
    mentionPositions.forEach((mention) => {
      // All mentions are marked with the mention class and set to atomic
      const mentionEl = this.codemirror.markText(mention.from, mention.to)
      const newMentionEl = document.createElement('span')
      newMentionEl.className = classes.mention
      newMentionEl.innerHTML = 'This is a replacement mention'
      mentionEl.replacedWith = newMentionEl
      mentionEl.atomic = true
      mentionEl.collapsed = true
      console.log(newMentionEl);
//      mentionEl.className = classes.mention
    })
  }
  updateValue = (newValue) => {
    const { model, change, value } = this.props
    this.checkForMentions()
    this.convertMentions()
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
      // Mark text
//      const markEl = this.codemirror.markText({ line: to.line, ch: to.ch - lastWord.length}, to);
//      markEl.className = 'link-primary'
//      markEl.atomic = true
      // Get the position
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
