import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import { actions } from 'react-redux-form';
import { remote } from 'electron';

import classes from './FileSelectInput.css'
import { MdFolder } from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

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
    const {model, value, children} = this.props;
    return (
      <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'} onClick={this.showModal}>
        {children}
        <div className={classes.text + ' flex'}>{value}</div>
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
