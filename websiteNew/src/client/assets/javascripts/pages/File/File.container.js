import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import { getMeta } from 'stemn-shared/misc/Files/Files.actions.js';
import File from './File';

const stateToProps = ({ files }, { params }) => {
  const { projectId, fileId, revisionId } = params;
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    cacheKey,
    fileId,
    fileMeta: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
  }
};

const dispatchToProps = {
  getMeta
};

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    const { fileId, projectId, revisionId } = props;
    props.getMeta({
      fileId,
      projectId,
      revisionId,
    })
  }
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class FileContainer extends Component {
  render() {
    console.log(this.props);
    return (
      <File {...this.props} />
    );
  }
}




