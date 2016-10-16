/**************************************************************************
We pass in either revisions or file1 + file2.
**************************************************************************/

// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';

// Component Core
import React from 'react';
import { getViewerType } from 'app/renderer/main/modules/Files/PreviewFile/PreviewFile.utils.js';

// Styles
import classNames from 'classnames';

// Sub Components
import PopoverMenu          from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton     from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { getCompareModes, getCompareIcon }  from '../FileCompare.utils.js';
import { MdMoreHoriz }      from 'react-icons/lib/md';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  popoutPreview(mode){
    this.props.electronWindowsActions.create({
      type: 'PREVIEW',
      props: {
        fileId: this.props.file1.fileId,
        revisionId: this.props.file1.revisionId,
      }
    })
    setTimeout(()=>{
      this.props.electronWindowsActions.parse();
    }, 100)
  },
  render() {
    const { mode, changeMode, revisions, file1, file2 } = this.props;

    if(!file1){return null};

    const previewType  = getViewerType(file1.extension, file1.provider);
    const compareModes = getCompareModes(previewType, previewType);
    const CompareIcon  = getCompareIcon(mode);
    return (
      <div>
        {
          revisions && revisions.length > 1 || file1 && file2 ?
          <PopoverMenu preferPlace="below">
            <SimpleIconButton title="Compare">
              <CompareIcon size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              {compareModes.map(item=><a key={item.value}
              className={classNames({'active': mode == item.value})}
              onClick={()=>changeMode(item.value)}>
                Compare: {item.text}
              </a>)}
            </div>
          </PopoverMenu>
          : null
        }
        <PopoverMenu preferPlace="below">
          <SimpleIconButton title="Options">
            <MdMoreHoriz size="20px" />
          </SimpleIconButton>
          <div className="PopoverMenu">
            <a onClick={this.displayFileInfo}>Discard Changes</a>
            <a onClick={this.displayFileInfo}>Open in explorer</a>
            <a onClick={this.displayFileInfo}>File Info</a>
            <a onClick={this.popoutPreview}>Preview</a>
          </div>
        </PopoverMenu>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    electronWindowsActions: bindActionCreators(ElectronWindowsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

