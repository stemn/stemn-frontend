// Component Core
import React from 'react'

import Button from 'stemn-shared/misc/Buttons/Button/Button'

class Component extends React.Component {
  state = {
    value: '',
  };

  onChange = (event) => {
    this.setState({ value: event.target.value })
  };

  render() {
    const {
      title, message,
      confirmValue, confirmPlaceholder,
      modalCancel, modalConfirm,
    } = this.props

    const { value } = this.state

    return (
      <div style={ { width: '400px' } }>
        <div className="modal-title">{title || 'Are you sure you want to do this?'}</div>
        <div className="modal-body" style={ { lineHeight: '1.4em' } }>
          <div dangerouslySetInnerHTML={ { __html: message || 'There will be no turning back.' } } />
          {confirmValue
            ? <input
              type="text"
              style={ { marginTop: '15px' } }
              className="dr-input"
              placeholder={ confirmPlaceholder }
              onChange={ this.onChange }
            />
            : null }
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={ { marginRight: '10px' } } onClick={ modalCancel }>Cancel</Button>
          <Button
            className="warn"
            disabled={ confirmValue && value.toLowerCase() !== confirmValue.toLowerCase() }
            onClick={ modalConfirm }
          >
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}

export default Component
