// Component Core
import React from 'react'
import { connect } from 'react-redux'

import { requestBetaCode, submitBetaCode } from 'stemn-shared/misc/Auth/Auth.actions.js'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

class Component extends React.Component {
  state = { value: '' };

  onChange = (event) => {
    this.setState({ value: event.target.value })
  };

  submitCode = () => {
    this.props.dispatch(submitBetaCode(this.state.value)).then(() => {
      this.props.modalConfirm()
    })
  };

  submitRequest = () => {
    this.props.dispatch(requestBetaCode())
  };

  render() {
    return (
      <div style={ { width: '400px' } }>
        <div className="modal-title">Request Beta Access</div>
        <div className="modal-body" style={ { lineHeight: '1.4em' } }>
          You have not yet been granted access to Stemn Desktop Beta. Please enter your access code or submit an access code request.
          <input
            type="text"
            style={ { marginTop: '15px' } }
            className="dr-input"
            placeholder="Beta Access Code"
            onChange={ this.onChange }
          />
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            style={ { marginRight: '10px' } }
            onClick={ this.submitRequest }
          >
            Request Code
          </Button>
          <Button
            className="primary"
            onClick={ this.submitCode }
          >
            Submit Code
          </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Component)
