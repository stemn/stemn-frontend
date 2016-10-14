import React from 'react';

import classes            from './CommitFile.css';

import TogglePanel        from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import { orderBy }        from 'lodash';

export default React.createClass({
  getInitialState () {
    return {
      selected1: this.props.file.revisions[0],
      selected2: this.props.file.revisions[1],
      lastSelected: 1,
      mode: this.props.file.revisions[0] && this.props.file.revisions[1] ? 'sideBySide' : 'single'
    }
  },
  onSelect(response){
    if(this.state.mode == 'single'){
      this.setState({
        selected1: response,
        lastSelected: 1
      })
    }
    else{
      if(this.state.lastSelected == 1){
        this.setState({
          selected2: response,
          lastSelected: 2
        })
      }
      else{
        this.setState({
          selected1: response,
          lastSelected: 1
        })
      }
    }
  },
  changeMode(mode){
    this.setState({mode: mode})
  },
  isSelected(item){
    const selected1 = item.data.revisionId == this.state.selected1.data.revisionId;
    const selected2 = item.data.revisionId == this.state.selected2.data.revisionId;

    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  },
  render() {
    const { file, project } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const items = mode == 'single' ? [selected1, selected1] : orderBy([selected1, selected2], item => (new Date(item.timestamp)).getTime());
    return (
      <TogglePanel>
        <div>{file.data.path}</div>
        <FileCompareMenu
          compareId={`feed-${project.data._id}-${file.data.fileId}`}
          file1={items[1].data}
          file2={items[0].data}
          revisions={file.revisions}
          mode={mode}
          changeMode={this.changeMode}
        />
        <DragResize side="bottom" height="500" heightRange={[0, 1000]} className="layout-column flex">
          <FileCompare
            compareId={`feed-${project.data._id}-${file.data.fileId}`}
            project={project.data}
            file1={items[1].data}
            file2={items[0].data}
            mode={mode} />
          <Timeline className={classes.timeline}
            size="sm"
            onSelect={this.onSelect}
            isSelected={this.isSelected}
            items={file.revisions}
            preferPlace="above" />
        </DragResize>
      </TogglePanel>
    )
  }
})
