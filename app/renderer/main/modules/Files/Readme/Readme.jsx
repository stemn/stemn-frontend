// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FilesActions from '../Files.actions.js';

// Component Core
import React, { PropTypes } from 'react';
import { omit } from 'lodash';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PreviewFile        from 'app/renderer/main/modules/Files/PreviewFile/PreviewFile.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  files        : PropTypes.array,
  filesActions : PropTypes.object,
};

export const Readme = React.createClass({
  propTypes: propTypesObject,
  render() {
    const { files } = this.props;
    console.log(files);
    const readmeNames = ['readme.md', 'readme.txt'];
    const readme = files.find(item => readmeNames.includes(item.name.toLowerCase()));
    console.log(readme);
    return (
      <div { ...omit(this.props, Object.keys(propTypesObject)) }>
        <PreviewFile file={readme} project={{project:{_id: readme.project}}}/>
      </div>
    )
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Readme);
