import React from 'react'

import expired from 'stemn-shared/assets/images/pure-vectors/expired.svg'
import { connect } from 'react-redux'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import previewExpiredModalName from 'stemn-shared/misc/Files/PreviewFile/Messages/PreviewExpired/PreviewExpiredModal'

export class PreviewExpired extends React.Component {
  render() {
    const { provider, dispatch } = this.props

    const openModal = () => {
      dispatch(ModalActions.showModal({ modalType: previewExpiredModalName, modalProps: { provider } }))
    }
    return (
      <div className="layout-column layout-align-center-center flex text-center">
        <div style={ { maxWidth: '300px' } }>
          <img style={ { width: '100px' } } src={ expired } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>This revision has expired</div>
          <div className="text-title-5">We could not find this revision in your <span style={ { textTransform: 'capitalize' } }>{provider || 'provider'}</span>.<br /> <a className="link-primary" onClick={ openModal }>Learn more.</a></div>
        </div>
      </div>
    )
  }
}

export default connect()(PreviewExpired)
