import React, { Component, PropTypes } from 'react'
import CodeMirror from 'react-codemirror'
import classes from './EditorNew.css'
import 'codemirror/mode/markdown/markdown'
import EditorToolbar from 'stemn-shared/misc/Editor/EditorToolbar'
import EditorMentions from 'stemn-shared/misc/Editor/EditorMentions'

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
      codemirror: null,
    }
  }
  updateValue = (newValue) => {
    const { model, change } = this.props
    change(model, newValue)
  }
  getCodeMirror = (ref) => {
    if (ref) {
      const codemirror = ref.getCodeMirror()
      this.setState({
        codemirror,
      })
    }
  }
  render() {
    const { value, hideToolbar } = this.props
    const { codemirror } = this.state

    return (
      <div>
        <EditorToolbar
          codemirror={ codemirror }
          hide={ hideToolbar }
        />
        <CodeMirror
          ref={ this.getCodeMirror }
          className={ classes.editor }
          value={ value }
          onChange={ this.updateValue }
          options={ options }
        />
        <EditorMentions
          codemirror={ codemirror }
          value={ value }
        />


      </div>
    )
  }
}
