import React, { Component } from 'react'
import codemirror from 'codemirror'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import Container from 'stemn-shared/misc/Layout/Container'

export default class Viewer extends Component {
  getCodemirrorRef = (ref) => {
    const { data, extension, hideNumbers } = this.props
    
    if (ref && extension) {
      this.codemirrorRef = ref
      this.codemirrorRef.innerHTML = ''
      // Plain text: CodeMirror mode packs (syntax highlighting) were never loaded since
      // the webpack 2 lazy loader was removed. See the follow-ups in docs.
      codemirror(this.codemirrorRef, {
        value: data,
        indentWithTabs: true,
        readOnly: true,
        dragDrop: false,
        lineWrapping: true,
        lineNumbers: !hideNumbers,
      })
    }
  }
  render() {
    const { data, previewMarkdown } = this.props

    return (
      <div className="layout-row flex">
        { previewMarkdown &&
        <div className="scroll-box flex" style={ { padding: '30px' } }>
          <Container>
            <EditorDisplay value={ data } />
          </Container>
        </div>
        }
        { !previewMarkdown &&
        <div className="scroll-box flex" ref={ this.getCodemirrorRef } />
        }
      </div>
    )
  }
}

