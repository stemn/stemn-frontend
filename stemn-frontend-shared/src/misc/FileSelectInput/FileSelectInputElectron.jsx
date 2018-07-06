import React from 'react'
import { connect } from 'react-redux'

import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { remote } from 'electron'
import cn from 'classnames'
import classes from './FileSelectInput.css'
import MdFolder from 'react-icons/md/folder'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'

class Component extends React.Component {
  showModal = () => {
    remote.dialog.showOpenDialog(null, {
      title: this.props.title,
      defaultPath: this.props.value,
      buttonLabel: 'Select Folder',
      properties: ['openDirectory'],
    }, (files) => {
      if (files && files[0]) {
        this.props.dispatch(storeChange(this.props.model, files[0]))
      }
    })
  };

  render() {
    const {
      value,
      children,
      placeholder,
    } = this.props
    return (
      <TextDisplayBox
        className={ classes.input }
        onClick={ this.showModal }
      >
        { children }
        <div className={ cn(classes.text, { [classes.placeholder]: !value }, 'flex') }>{value || placeholder}</div>
        <SimpleIconButton>
          <MdFolder size="22" />
        </SimpleIconButton>
      </TextDisplayBox>
    )
  }
}

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
