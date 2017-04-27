import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { upload } from '../Upload.actions.js'
import { actions } from 'react-redux-form'
import Upload from './Upload'

const mapStateToProps = ({ upload }, { uploadId }) => ({
  uploadData: upload[uploadId]
})

const mapDispatchToProps = {
  upload,
  change: actions.change,
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
