import React from 'react'
import { connect } from 'react-redux'

import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import { getBridge } from 'stemn-shared/desktop/bridge'
import cn from 'classnames'
import classes from './FileSelectInput.module.css'
import { MdFolder } from 'react-icons/md'
import { SimpleIconButton } from 'stemn-shared/misc/Buttons/SimpleIconButton'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'

class Component extends React.Component {
  showModal = () => {
    getBridge().dialog.selectDirectory({
      title: this.props.title,
      defaultPath: this.props.value,
      buttonLabel: 'Select Folder',
    }).then((folder) => {
      if (folder) {
        this.props.dispatch(storeChange(this.props.model, folder))
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
