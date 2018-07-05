import React, { Component } from 'react'
import classes from './EditorMentions.css'
import MentionPopover from 'stemn-shared/misc/Search/MentionPopover'
import { getMentionInfo, parseMentions, getMentionString, mentionTypeFromWord, newMention } from 'stemn-shared/misc/Mentions/Mentions.utils'

// The will split at new line
const getValueInLineFormat = (value = '') => value.split('\n')

// The will find all the mentions and return them in line/ch format
const findAllMentionsPositions = (value = '') => {
  const valueInLineFormat = getValueInLineFormat(value)
  const mentionsInEachLine = valueInLineFormat.map(parseMentions)
  const allMentions = []
  mentionsInEachLine.forEach((mentions, index) => {
    mentions.forEach(mention => allMentions.push({
      ...mention,
      from: {
        line: index,
        ch: mention.index.from,
      },
      to: {
        line: index,
        ch: mention.index.to,
      },
    }))
  })
  return allMentions
}


export default class EditorMentions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      caretPosition: {
        top: 0,
        left: 0,
      },
      cursorRange: {
        from: {
          line: 0,
          ch: 0,
        },
        to: {
          line: 0,
          ch: 0,
        },
      },
      query: '',
      showPopover: false,
      mentionType: '',
    }
  }
  componentDidMount() {
    const { codemirror } = this.props
    this.convertMentions(codemirror)
  }
  componentWillReceiveProps() {
    const { codemirror } = this.props
    if (codemirror) {
      this.getCaretPosition()
      this.checkForMentions(codemirror)
      setTimeout(() => this.convertMentions(codemirror))
    }
  }
  convertMentions = (codemirror) => {
    // Get the position of all the valid mentions
    const mentionPositions = findAllMentionsPositions(codemirror.getValue())
    mentionPositions.forEach((mention) => {
      // All mentions are marked with the mention class and set to atomic
      const mentionInfo = getMentionInfo(mention.mentionType, mention.entityId, mention.display)
      if (mentionInfo) {
        const newMentionEl = document.createElement('span')
        newMentionEl.className = classes.mention
        newMentionEl.innerHTML = `${mentionInfo.display}`
        const mentionEl = codemirror.markText(mention.from, mention.to, {
          replacedWith: newMentionEl,
          atomic: true,
        })
      }
    })
  }
  getCaretPosition = () => {
    const caretEl = this.props.codemirror.display.cursorDiv.firstChild
    if (caretEl) {
      const caretPosition = caretEl.getBoundingClientRect()
      this.setState({
        caretPosition: {
          left: caretPosition.left,
          top: caretPosition.top,
        },
      })
    }
  }
  checkForMentions = (codemirror) => {
    const cursor = codemirror.getCursor()
    // Get the content up to the cursor
    const valueUpToCursor = codemirror.getLine(cursor.line)
    
    // Get the word just before the cursor
    const wordsSplit = valueUpToCursor.substring(0, cursor.ch).split(' ')
    const lastWord = wordsSplit[wordsSplit.length - 1]

    // We get the mention type from the word (if it begins with a valid trigger)
    const mentionType = mentionTypeFromWord(lastWord)

    // If we find a mention
    if (mentionType) {
      // Determine the cursor range
      const cursorRange = {
        from: {
          line: cursor.line,
          ch: cursor.ch - lastWord.length,
        },
        to: {
          line: cursor.line,
          ch: cursor.ch,
        },
      }
      // Mark the text of the partial mention
      codemirror.markText(cursorRange.from, cursorRange.to, {
        className: classes.mentionUnderway,
      })
      // Set the state to reflect the cursor, query and mention type
      this.setState({
        cursorRange,
        query: lastWord.substring(1),
        showPopover: true,
        mentionType,
      })
    } else {
      // If we don't have a mention
      // Remove all mentionUnderway marks
      const allMarks = codemirror.getAllMarks()
      allMarks.forEach((mark) => {
        if (mark.className ===  classes.mentionUnderway) {
          mark.clear()
        }
      })
      // Hide the popover
      this.setState({
        showPopover: false,
      })
    }
  }
  addMention = (result) => {
    const { codemirror } = this.props
    const { cursorRange } = this.state

    // Create the mention object from the result
    const mention = newMention({
      display: result.name,
      entityId: result._id,
      mentionType: this.state.mentionType,
    })
    const mentionString = `${getMentionString(mention)}`

    // Insert mention at cursor
    codemirror.replaceRange(mentionString, cursorRange.from, cursorRange.to)

    // Reposition the cursor
    codemirror.focus()
    codemirror.setCursor({
      line: cursorRange.from.line,
      ch: cursorRange.from.ch + mentionString.length,
    })

    // Hide the mention popover
    this.setState({
      showPopover: false,
    })

    // Convert the new mentions
    this.convertMentions(codemirror)
  }
  render() {
    const { caretPosition, query, showPopover, mentionType } = this.state
    return (
      <MentionPopover
        cacheKey={ `mentions-${mentionType}` }
        caretPosition={ caretPosition }
        addMention={ this.addMention }
        showPopover={  showPopover }
        query={ query }
        entityType={ mentionType }
      />
    )
  }
}
