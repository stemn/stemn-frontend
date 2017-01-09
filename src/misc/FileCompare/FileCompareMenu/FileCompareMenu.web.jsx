/**************************************************************************
We pass in either revisions or file1 + file2.
**************************************************************************/

// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';
import { getViewerType } from 'stemn-frontend-shared/src/misc/Files/PreviewFile/PreviewFile.utils.js';

// Styles
import classNames from 'classnames';

// Sub Components
import SimpleIconButton     from 'stemn-frontend-shared/src/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { getCompareModes, getCompareIcon }  from '../FileCompare.utils.js';
import MdMoreHoriz          from 'react-icons/md/more-horiz';
import MdOpenInNew          from 'react-icons/md/open-in-new';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render(){
    const { enablePreview, mode, changeMode, revisions, file1, file2, dispatch } = this.props;

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
              onClick={()=>changeMode(item.value, revisions)}>
                Compare: {item.text}
              </a>)}
            </div>
          </PopoverMenu>
          : null
        }
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
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

