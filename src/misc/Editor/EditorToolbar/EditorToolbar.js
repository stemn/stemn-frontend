import React, { Component, PropTypes } from 'react'
import classes from './EditorToolbar.css'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdFormatItalic from 'react-icons/md/format-italic'
import MdFormatBold from 'react-icons/md/format-bold'
import MdLink from 'react-icons/md/link'
import MdFormatListBulleted from 'react-icons/md/format-list-bulleted'
import MdInsertPhoto from 'react-icons/md/insert-photo'
import MdTextFields from 'react-icons/md/text-fields'
import MdCode from 'react-icons/md/code'
import MathIcon from 'stemn-shared/assets/icons/editor/math'

export default class EditorToolbar extends Component {
  cursorWrap = (cursorRange, contentFunction) => {
    const { codemirror } = this.props
    const content = codemirror.getRange(cursorRange.from, cursorRange.to)
    // Insert the content at the cursor's position
    codemirror.replaceRange(contentFunction(content), cursorRange.from, cursorRange.to)
  }
  getCursor = () => {
    const { codemirror } = this.props
    return {
      from: codemirror.getCursor('from'),
      to: codemirror.getCursor('to'),
    }
  }
  cursorSet = (cursorRange, deltaLine, deltaCh) => {
    // This will reposition the cursor at a new line/character
    // The inputs will be added/subtracted from the current position
    const { codemirror } = this.props
    // Focus the editor
    codemirror.focus()
    // Set the new cursor
    codemirror.setCursor({
      line: cursorRange.from.line + deltaLine,
      ch: cursorRange.from.ch + deltaCh,
    })
  }
  upload = () => {
    this.props.showUploadModal().then(({ value }) => {
      const cursorRange = this.getCursor()
      this.cursorWrap(cursorRange, (content) => `\n ![${ content || 'alt text' }](${ value.url })`)
      this.cursorSet(cursorRange, 1, 0)
    })
  }
  bold = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, (content) => `**${content}**`)
    this.cursorSet(cursorRange, 0, 2)
  }
  heading = () => {
    const cursorRange = this.getCursor()
    if (cursorRange.from.ch === 0) {
      // If we are at the start of a line, wrap
      this.cursorWrap(cursorRange, (content) => `# ${content}`)
      this.cursorSet(cursorRange, 0, 2)
    } else {
      // Else, make a new line and then wrap
      this.cursorWrap(cursorRange, (content) => `\n# ${content}`)
      this.cursorSet(cursorRange, 1, 2)
    }
  }
  italic = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, (content) => `*${content}*`)
    this.cursorSet(cursorRange, 0, 1)
  }
  bullet = () => {
    const cursorRange = this.getCursor()
    if (cursorRange.from.ch === 0) {
      // If we are at the start of a line, wrap
      this.cursorWrap(cursorRange, (content) => `* ${content}`)
      this.cursorSet(cursorRange, 0, 2)
    } else {
      // Else, make a new line and then wrap
      this.cursorWrap(cursorRange, (content) => `\n* ${content}`)
      this.cursorSet(cursorRange, 1, 2)
    }
  }
  link = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, (content) => `[${ content || 'text' }](url)`)
    this.cursorSet(cursorRange, 0, 1)
  }
  code = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, (content) => `\`\`\`\n${ content } \n\`\`\``)
    this.cursorSet(cursorRange, 1, 0)
  }
  math = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, (content) => `$$${ content }$$`)
    this.cursorSet(cursorRange, 0, 2)
  }
  buttons = [{
    title: 'Heading',
    onClick: this.heading,
    icon: <MdTextFields />,
  },{
    title: 'Bold',
    onClick: this.bold,
    icon: <MdFormatBold />,
  },{
    title: 'Italic',
    onClick: this.italic,
    icon: <MdFormatItalic />,
  },{
    title: 'List',
    onClick: this.bullet,
    icon: <MdFormatListBulleted />,
  },{
    title: 'Image',
    onClick: this.upload,
    icon: <MdInsertPhoto />,
  },{
    title: 'Link',
    onClick: this.link,
    icon:  <MdLink />,
  },{
    title: 'Code',
    onClick: this.code,
    icon:  <MdCode />,
  },{
    title: 'Equation',
    onClick: this.math,
    icon:  <MathIcon />,
  }]
  render() {
    const { hide } = this.props
    if (!hide) {
      return (
        <div className={ classes.toolbar }>
          { this.buttons.map(button => (
            <SimpleIconButton
              key={ button.title }
              onClick={ button.onClick }
              title={ button.title }
            >
              { button.icon }
            </SimpleIconButton>
          ))}
        </div>
      )
    } else {
      return null
    }
  }
}
