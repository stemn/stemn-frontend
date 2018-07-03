import React from 'react'
import modelLocked from 'stemn-shared/assets/images/pure-vectors/model-locked.svg'
import { connect } from 'react-redux'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import assemblyPartNotFoundModalName from 'stemn-shared/misc/Files/PreviewFile/Messages/AssemblyPartNotFound/AssemblyPartNotFoundModal'
import classes from './AssemblyPartNotFound.scss'

export class AssemblyPartNotFound extends React.Component {
  render() {
    const { dispatch, parts } = this.props

    const openModal = () => {
      dispatch(ModalActions.showModal({ modalType: assemblyPartNotFoundModalName, modalProps: { parts } }))
    }

    console.log(parts)
    return (
      <div className="layout-column layout-align-center-center flex text-center">
        <div style={ { maxWidth: '300px' } }>
          <img style={ { width: '100px' } } src={ modelLocked } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>Assembly part{parts.length > 1 && 's'} could not be found!</div>
          <div className={ classes.well }>
            { parts.map(part => <div className="text-title-5" key={ part }>{ part }</div>) }
          </div>
          <div className="text-title-5">Assembly rendering is Beta.<br /><a className="link-primary" onClick={ openModal }>Help us fix it.</a></div>
        </div>
      </div>
    )
  }
}

export default connect()(AssemblyPartNotFound)

