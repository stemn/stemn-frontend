// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileCompareActions from '../FileCompare.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import PopoverMenu        from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton   from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

import {getCompareModes}  from '../FileCompare.utils.js';
import {MdMoreHoriz}      from 'react-icons/lib/md';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  setCompareMode(mode){
    this.props.fileCompareActions.changeMode({
      compareId: this.props.compareId,
      mode
    })
  },
  render() {
    const { fileCompare } = this.props;
    if(!fileCompare){return null};

    return (
      <PopoverMenu preferPlace="below">
        <SimpleIconButton>
          <MdMoreHoriz size="20px"/>
        </SimpleIconButton>
        <div className="PopoverMenu">
          {getCompareModes(fileCompare.previewType1, fileCompare.previewType2).map((item)=><a key={item.value} className={classNames({'active': fileCompare.mode == item.value})} onClick={()=>this.setCompareMode(item.value)}>Compare: {item.text}</a>)}
          <div className="divider"></div>
          <a onClick={this.displayFileInfo}>Discard Changes</a>
          <a onClick={this.displayFileInfo}>Open in explorer</a>
          <a onClick={this.displayFileInfo}>File Info</a>
        </div>
      </PopoverMenu>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({fileCompare}, {compareId}) {
  return {
    fileCompare: fileCompare[compareId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fileCompareActions: bindActionCreators(FileCompareActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

