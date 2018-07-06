// Component Core
import React from 'react'

import Button from 'stemn-shared/misc/Buttons/Button/Button'

class Component extends React.Component {
  render() {
    const {
      title,
      body,
      modalConfirm,
    } = this.props

    return (
      <div style={ { width: '500px' } }>
        <div className="modal-title">{title}</div>
        <div className="modal-body" style={ { lineHeight: '1.4em' } } dangerouslySetInnerHTML={ { __html: body } } />
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button className="warn" onClick={ modalConfirm }>OK</Button>
        </div>
      </div>
    )
  }
}

export default Component
