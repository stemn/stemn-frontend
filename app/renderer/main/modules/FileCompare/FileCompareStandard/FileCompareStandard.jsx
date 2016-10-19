import React from 'react';

import classes            from './FileCompareStandard.css';

import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import FileCompareInner   from 'app/renderer/main/modules/FileCompare/FileCompareInner/FileCompareInner.jsx';

export default React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.file1 != prevProps.file1){
      this.setState({
        mode: nextProps.file1 && nextProps.file2 ? 'sideBySide' : 'single'
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  changeMode(mode){
    this.setState({mode: mode})
  },
  render() {
    const { file1, file2, project } = this.props;
    const { mode } = this.state;

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{file1.path}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            mode={mode}
            changeMode={this.changeMode}
            enablePreview={true}
          />
        </div>
        <div className="layout-column flex">
          <FileCompareInner
            project={project}
            file1={file1}
            file2={file2}
            mode={mode}
          />
        </div>
      </div>
    )
  }
})
