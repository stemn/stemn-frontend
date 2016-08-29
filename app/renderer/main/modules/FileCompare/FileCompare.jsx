import React from 'react';

import PreviewFile from 'app/renderer/main/containers/PreviewFile';
import FileCompareSlider from './components/FileCompareSlider.jsx';

// Styles
import classes from './FileCompare.css';
import classNames from 'classnames';

export default React.createClass({
  getInitialState () {
    return {
      position: 0
    };
  },
  sliderChange (position){
    this.setState({position: position});

  },
  render() {
    const {project, file} = this.props;
    return (
      <div className={classNames('layout-row','flex', 'sideBySide', 'rel-box')} ref="container">
        <div className={classes.preview1 + ' flex layout-column'}>
          <PreviewFile project={project} file={file} />
        </div>
        <FileCompareSlider container={this.refs.container} changeFn={this.sliderChange} position={this.state.position}/>
        <div className={classes.preview2 + ' flex layout-column'}>
          <PreviewFile project={project} file={file} />
        </div>
      </div>
    );
  }
});



