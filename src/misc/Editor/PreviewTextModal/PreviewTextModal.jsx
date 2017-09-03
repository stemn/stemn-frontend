import React, { Component } from 'react'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import s from './PreviewTextModal.scss'
import cn from 'classnames'

export default class PreviewTextModal extends Component {
  render() {
    const { text, modalConfirm } = this.props

    return (
      <div className={ cn(s.modal, 'layout-column') }>
        <div className="modal-title">Preview</div>
        <div className="modal-body flex scroll-box">
          <EditorDisplay value={ text } />
        </div>
        <div className="modal-footer layout-row layout-align-end">
          <Button
            className="primary"
            onClick={ modalConfirm }
          >
            Close
          </Button>
        </div>
      </div>
    )
  }
}

