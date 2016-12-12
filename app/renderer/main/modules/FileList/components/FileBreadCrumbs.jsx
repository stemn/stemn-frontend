import React from 'react';
import i from 'icepick';

// Styles
import classNames from 'classnames';
import classes from './FileBreadCrumbs.css';

import { middle as middleConcat } from 'app/shared/helpers/stringConcat';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import FileListPopup from './FileListPopup.jsx';

export default React.createClass({
  defaultProps: {
    popup: false
  },
  render() {
    const { meta, clickFn, className, popup } = this.props;

    const displayCrumbs = () => {
      if(meta.parents && meta.parents.length > 0){
        const parentsWithName = i.push(meta.parents, {
          name: meta.name,
          fileId: meta.fileId
        });
        return parentsWithName.map((folder, idx) => {
          const isLastChild = idx == parentsWithName.length - 1;
          const parentfolder = parentsWithName[idx - 1];
          return parentfolder && popup && idx != 0
          ? <span key={idx}>
              <PopoverMenu trigger="hoverDelay" preferPlace="below" tipSize={6}>
                <span style={{display: 'inline-block'}}>
                  { !isLastChild
                  ? <a onClick={()=>clickFn({file: folder})}>{middleConcat(folder.name, 30, 0.8)}</a>
                  : <span>{middleConcat(folder.name, 30, 0.8)}</span> }
                </span>
                <FileListPopup parentfolder={parentfolder} activeFolder={folder} meta={meta} clickFn={clickFn}/>
              </PopoverMenu>
              {!isLastChild ? <span> / </span> : null}
            </span>
          : <span key={idx}>
              { !isLastChild
              ? <a onClick={()=>clickFn({file: folder})}>{middleConcat(folder.name, 30, 0.8)}</a>
              : <span>{middleConcat(folder.name, 30, 0.8)}</span> }
              {!isLastChild ? <span> / </span> : null}
            </span> }
          )
      }
      else if (meta.name){
        return <span>{middleConcat(meta.name, 30, 0.8)}</span>
      }
      else{
        return <span>. . .</span>
      }
    }

    return (
      <div className={classNames(classes.crumbs, className)}>
        {displayCrumbs()}
      </div>
    );
  }
});
