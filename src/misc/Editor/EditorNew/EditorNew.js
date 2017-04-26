import React, { Component, PropTypes } from 'react'
import CodeMirror from 'react-codemirror'
import classes from './EditorNew.css'
import 'codemirror/mode/markdown/markdown'
import { replaceMentions } from 'stemn-shared/misc/Mentions/Mentions.utils'
import { connect } from 'react-redux'
import { actions } from 'react-redux-form'
import MentionPopover from 'stemn-shared/misc/Search/MentionPopover'
import getUuid from 'stemn-shared/utils/getUuid'
import { getMentionString } from 'stemn-shared/misc/Mentions/Mentions.utils'

class EditorNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      caretPosition: {
        top: 0,
        left: 0,
      },
      query: '',
      showPopover: false,
    }
  }
  updateValue = (value) => {
    const { model, dispatch } = this.props
    dispatch(actions.change(model, value))
    this.checkForMentions()
  }
  codeMirror = null
  getCodeMirrorRef = (ref) => {
    if (ref) {
      this.codeMirror = ref.getCodeMirror()
    }
  }
  checkForMentions = () => {
    const from = { line: 0, ch: 0, }
    const to = this.codeMirror.getCursor()
    // Get the content up to the cursor
    const valueUpToCursor = this.codeMirror.getRange(from, to)
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
    const mention = {
      display: result.name,
      entityId: result._id,
      mentionType: 'user',
      mentionId: getUuid(),
    }
    const mentionString = getMentionString(mention)

    console.log(mentionString);
  }
  render() {
    const options = {
      lineNumbers: false,
      mode: 'markdown',
      dragDrop: false,
      lineWrapping: true,
    }
    const { value } = this.props
    const { caretPosition, query, showPopover } = this.state

    const caretPositionStyles = {
      left: caretPosition.left,
      top: caretPosition.top,
    }

    return (
      <div>
        <CodeMirror
          ref={ this.getCodeMirrorRef }
          className={ classes.editor }
          value={ replaceMentions(value) }
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


export default connect()(EditorNew);
