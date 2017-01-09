import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import { actions } from 'react-redux-form';
import { remote } from 'electron';

import classNames from 'classnames';
import classes from './FileSelectInput.css'
import MdFolder from 'react-icons/md/folder';
import SimpleIconButton from 'stemn-frontend-shared/src/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'

const Component = React.createClass({
  showModal(){
    remote.dialog.showOpenDialog(null, {
      title: this.props.title,
      defaultPath: this.props.value,
      buttonLabel: 'Select Folder',
      properties: ['openDirectory']
    }, (files) => {
      if(files && files[0]){
        this.props.dispatch(actions.change(this.props.model, files[0]))
      }
    })
  },
  render() {
    const { model, value, children, placeholder } = this.props;
    return (
      <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'} onClick={this.showModal}>
        {children}
        <div className={classNames(classes.text, {[classes.placeholder] : !value}, 'flex')}>{value || placeholder}</div>
        <SimpleIconButton>
          <MdFolder size="22" />
        </SimpleIconButton>
      </div>
    );
  }
});

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
