import React from 'react';
import { connect }            from 'react-redux';
import classes                from './FileCompare.css';

import { orderItemsByTime }   from 'stemn-shared/misc/FileCompare/FileCompare.utils.js';
import TogglePanel            from 'stemn-shared/misc/TogglePanel/TogglePanel.jsx';
import DragResize             from 'stemn-shared/misc/DragResize/DragResize.jsx';
import FileCompareMenu        from 'stemn-shared/misc/FileCompare/FileCompareMenu';
import FileCompareInner       from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner.jsx';
import Timeline               from 'stemn-shared/misc/Timeline/Timeline.jsx';
import { websocketJoinFile, websocketLeaveFile }  from 'stemn-shared/misc/Files/actions';
import { orderBy, has }       from 'lodash';

export const FileCompare = React.createClass({
  // Mounting
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.file != prevProps.file){
      this.setState({
        selected1    : nextProps.file.revisions && nextProps.file.revisions[0] ? nextProps.file.revisions[0] : nextProps.file,
        selected2    : nextProps.file.revisions && nextProps.file.revisions.length > 1 ? nextProps.file.revisions[nextProps.file.revisions.length - 1] : undefined,
        lastSelected : 1,
        mode         : nextProps.file.revisions && nextProps.file.revisions.length > 1 ? 'sideBySide' : 'single'
      })

      // Join the File room
      nextProps.dispatch(websocketJoinFile({
        fileId: nextProps.file.data.fileId
      }))
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillUnmount() {
    // Join the File room
    this.props.dispatch(websocketLeaveFile({
      fileId: this.props.file.data.fileId
    }))
  },

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
        <TogglePanel cacheKey={file.data.fileId+'-'+file.data.revisionId}>
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
              event={selected1}
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
            <div className="flex">{file.data.path}</div>
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
              event={selected1}
              file1={file1}
              file2={file2}
              mode={mode}
              header={['sideBySide', 'aboveAndBelow'].includes(mode)}
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

export default connect()(FileCompare)
