import React from 'react';

import classes            from './FileCompare.css';

import { orderItemsByTime } from 'app/renderer/main/modules/FileCompare/FileCompare.utils.js';
import TogglePanel        from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import FileCompareInner   from 'app/renderer/main/modules/FileCompare/FileCompareInner/FileCompareInner.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import { orderBy, has }   from 'lodash';

export default React.createClass({
  // Mounting
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.file != prevProps.file){
      this.setState({
        selected1    : nextProps.file.revisions[0],
        selected2    : nextProps.file.revisions.length > 1 ? nextProps.file.revisions[nextProps.file.revisions.length - 1] : undefined,
        lastSelected : 1,
        mode         : nextProps.file.revisions.length > 1 ? 'sideBySide' : 'single'
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  onSelect(response){
    const selectState = this.state.mode == 'single' || this.state.lastSelected == 2
    ? {selected1: response, lastSelected: 1}
    : {selected2: response, lastSelected: 2};
    this.setState(selectState);
    //if(this.state.selected1 == this.state.selected2){this.setState({mode: 'single'})}
  },
  changeMode(mode, revisions){
    let { selected1, selected2 } = this.state;
    // If a second file is not selected - we select one if possible
    if(!selected2){
      const revisionIndex = revisions.findIndex(revision => revision.data.fileId == selected1.data.fileId && revision.data.revisionId == selected1.data.revisionId);
      if(revisions[revisionIndex - 1]){selected2 = revisions[revisionIndex - 1];}
      else if(revisions[revisionIndex + 1]){selected2 = revisions[revisionIndex + 1];}
    }
    this.setState({mode, selected2})
  },
  isSelected(item){
    const selected1 = has(this.state, 'selected1.data.revisionId') ? item.data.revisionId == this.state.selected1.data.revisionId : false;
    const selected2 = has(this.state, 'selected2.data.revisionId') ? item.data.revisionId == this.state.selected2.data.revisionId : false;
    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  },
  render() {
    const { file, project, type } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const items = orderItemsByTime(mode, selected1, selected2);
    const file1 = items[0] ? items[0].data : undefined;
    const file2 = items[1] ? items[1].data : undefined;
    
    const collapseTemplate = () => {
      return (
        <TogglePanel>
          <div>{file.data.path}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={file.revisions}
            mode={mode}
            changeMode={this.changeMode}
            enablePreview={true}
          />
          <DragResize side="bottom" height="500" heightRange={[0, 1000]} className="layout-column flex">
            <FileCompareInner
              project={project.data}
              file1={file1}
              file2={file2}
              mode={mode} />
            { file.revisions.length > 1
            ? <Timeline className={classes.timeline}
              size="sm"
              onSelect={this.onSelect}
              isSelected={this.isSelected}
              items={file.revisions}
              preferPlace="above" />
            : null }
          </DragResize>
        </TogglePanel>
      )
    }  
    
    const standardTemplate = () => {
      return (
        <div className="layout-column flex">
          <div className={classes.header + ' layout-row layout-align-start-center'}>
            <div className="flex">{items[0].path}</div>
            <FileCompareMenu
              file1={file1}
              file2={file2}
              revisions={file.revisions}
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
          <Timeline className={classes.timeline}
            size="sm"
            onSelect={this.onSelect}
            isSelected={this.isSelected}
            items={file.revisions}
            preferPlace="above" />
        </div>
      )
    }
    
    return type == 'collapse' ? collapseTemplate() : standardTemplate()
  }
})
