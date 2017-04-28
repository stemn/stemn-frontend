import React, { Component, PropTypes } from 'react'
import CodeMirror from 'react-codemirror'
import classes from './EditorNew.scss'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/stex/stex'
import EditorToolbar from 'stemn-shared/misc/Editor/EditorToolbar'
import EditorMentions from 'stemn-shared/misc/Editor/EditorMentions'
import codemirrorLib from 'codemirror'
import 'codemirror/addon/mode/multiplex'
//import 'codemirror/addon/mode/overlay'
//
//codemirrorLib.defineMode("markdownPlus", (config, parserConfig) => {
//  const overlayMode = {
//    token: (stream, state) => {
//      var ch;
//      if (stream.match("{{")) {
//        while ((ch = stream.next()) != null)
//          if (ch == "}" && stream.next() == "}") {
//            stream.eat("}");
//            return "stex";
//          }
//      }
//      while (stream.next() != null && !stream.match("{{", false)) {}
//      return null;
//    }
//  };
//  const baseMode = codemirrorLib.getMode(config, "text/x-markdown")
////  const overlayMode = codemirrorLib.getMode(config, "text/x-latex")
//
//  return codemirrorLib.overlayMode(baseMode, overlayMode);
//});


codemirrorLib.defineMode('markdownWitLatex', (config) => {
  const baseMode = codemirrorLib.getMode(config, 'text/x-markdown')
  const latex$$ = {
    open: '$$',
    close: '$$',
    mode: codemirrorLib.getMode(config, 'text/x-latex'),
    delimStyle: "delimit"
  }
  const latex$ = {
    open: '$',
    close: '$',
    mode: codemirrorLib.getMode(config, 'text/x-latex'),
    delimStyle: "delimit"
  }
  return codemirrorLib.multiplexingMode(baseMode, latex$$)
})


const options = {
  lineNumbers: false,
  mode: 'markdownWitLatex',
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
  focus = () => {}
  getCodeMirror = (ref) => {
    if (ref) {
      const codemirror = ref.getCodeMirror()
      this.focus = ref.focus
      this.setState({
        codemirror,
      })
      this.focus()
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
        { codemirror
        ? <EditorMentions
            codemirror={ codemirror }
            value={ value }
          />
        : null }
      </div>
    )
  }
}
