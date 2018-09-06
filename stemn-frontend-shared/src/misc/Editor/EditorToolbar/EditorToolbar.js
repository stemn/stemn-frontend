import React, { Component } from 'react'
import classes from './EditorToolbar.css'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdFormatItalic from 'react-icons/md/format-italic'
import MdFormatBold from 'react-icons/md/format-bold'
import MdLink from 'react-icons/md/link'
import MdVisibility from 'react-icons/md/visibility'
import MdFormatListBulleted from 'react-icons/md/format-list-bulleted'
import MdInsertPhoto from 'react-icons/md/insert-photo'
import MdTextFields from 'react-icons/md/text-fields'
import MdCode from 'react-icons/md/code'
import MathIcon from 'stemn-shared/assets/icons/editor/math'
import Popover from 'stemn-shared/misc/Popover/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import { repeat } from 'lodash'

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
      this.cursorWrap(cursorRange, content => `\n ![${content || 'alt text'}](${value.url})`)
      this.cursorSet(cursorRange, 1, 0)
    })
  }
  bold = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `**${content}**`)
    this.cursorSet(cursorRange, 0, 2)
  }
  heading = (level = 1) => {
    const cursorRange = this.getCursor()
    if (cursorRange.from.ch === 0) {
      // If we are at the start of a line, wrap
      this.cursorWrap(cursorRange, content => `${repeat('#', level)} ${content}`)
      this.cursorSet(cursorRange, 0, level + 1)
    } else {
      // Else, make a new line and then wrap
      this.cursorWrap(cursorRange, content => `\n${repeat('#', level)} ${content}`)
      this.cursorSet(cursorRange, 1, level + 1)
    }
  }
  italic = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `*${content}*`)
    this.cursorSet(cursorRange, 0, 1)
  }
  bullet = () => {
    const cursorRange = this.getCursor()
    if (cursorRange.from.ch === 0) {
      // If we are at the start of a line, wrap
      this.cursorWrap(cursorRange, content => `* ${content}`)
      this.cursorSet(cursorRange, 0, 2)
    } else {
      // Else, make a new line and then wrap
      this.cursorWrap(cursorRange, content => `\n* ${content}`)
      this.cursorSet(cursorRange, 1, 2)
    }
  }
  link = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `[${content || 'text'}](url)`)
    this.cursorSet(cursorRange, 0, 1)
  }
  code = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `\`\`\`\n${content} \n\`\`\``)
    this.cursorSet(cursorRange, 1, 0)
  }
  codeInline = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `\`${content}\``)
    this.cursorSet(cursorRange, 0, 1)
  }
  math = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `$$\n${content || 'write latex math here'}\n$$`)
    this.cursorSet(cursorRange, 1, 0)
  }
  mathInline = () => {
    const cursorRange = this.getCursor()
    this.cursorWrap(cursorRange, content => `$${content || 'write latex math here'}$`)
    this.cursorSet(cursorRange, 0, 1)
  }
  preview = () => {
    const { showPreviewModal, codemirror } = this.props
    showPreviewModal({
      text: codemirror.getValue(),
    })
  }
  buttons = [{
    title: 'Heading',
    onClick: () => this.heading(3),
    icon: <MdTextFields />,
    menu: [{
      label: 'Heading 1 (#)',
      onClick: () => this.heading(1),
    }, {
      label: 'Heading 2 (##)',
      onClick: () => this.heading(2),
    }, {
      label: 'Heading 3 (###)',
      onClick: () => this.heading(3),
    }, {
      label: 'Heading 4 (####)',
      onClick: () => this.heading(4),
    }],
  }, {
    title: 'Bold',
    onClick: this.bold,
    icon: <MdFormatBold />,
  }, {
    title: 'Italic',
    onClick: this.italic,
    icon: <MdFormatItalic />,
  }, {
    title: 'List',
    onClick: this.bullet,
    icon: <MdFormatListBulleted />,
  }, {
    title: 'Image',
    onClick: this.upload,
    icon: <MdInsertPhoto />,
  }, {
    title: 'Link',
    onClick: this.link,
    icon: <MdLink />,
  }, {
    title: 'Code',
    onClick: this.code,
    icon: <MdCode />,
    menu: [{
      label: 'Code Block',
      onClick: this.code,
    }, {
      label: 'Inline Code',
      onClick: this.codeInline,
    }],
  }, {
    title: 'Equation',
    onClick: this.math,
    icon: <MathIcon />,
    menu: [{
      label: 'Block Equation',
      onClick: this.math,
    }, {
      label: 'Inline Equation',
      onClick: this.mathInline,
    }],
  }, {
    sep: true,
    title: 'Preview',
    onClick: this.preview,
    icon: <MdVisibility />,
  }]
  render() {
    const { hide } = this.props
    if (!hide) {
      return (
        <div className={ classes.toolbar }>
          { this.buttons.map(button => (!button.menu
            ? <SimpleIconButton
              className={ button.sep ? classes.sep : '' }
              key={ button.title }
              onClick={ button.onClick }
              title={ button.title }
            >
              { button.icon }
            </SimpleIconButton>
            : <Popover
              key={ button.title }
              trigger="hoverDelay"
              preferPlace="below"
            >
              <SimpleIconButton
                className={ button.sep ? classes.sep : '' }
                onClick={ button.onClick }
                title={ button.title }
              >
                { button.icon }
              </SimpleIconButton>
              <PopoverMenuList menu={ button.menu } />
            </Popover>),
          )}
        </div>
      )
    } 
    return null
  }
}
