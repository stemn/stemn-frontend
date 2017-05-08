/**************************************************************************
We pass in either revisions or file1 + file2.
**************************************************************************/
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils.js'
import classNames from 'classnames'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { getCompareModes, getCompareIcon } from '../FileCompare.utils.js'
import Popover from 'stemn-shared/misc/Popover'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import MdOpenInNew from 'react-icons/md/open-in-new'


export const Component = React.createClass({
  render(){
    const { enablePreview, mode, changeMode, revisions, file1, file2, dispatch } = this.props;

    if (!file1){ return null }

    const previewType = getViewerType(file1.extension, file1.provider)
    const compareModes = getCompareModes(previewType, previewType)
    const CompareIcon = getCompareIcon(mode)
    const hasRevisions = revisions && revisions.length > 1 || file1 && file2

    return (
      <div className="layout-row layout-align-start-center">
        { hasRevisions &&
          <Popover preferPlace="below">
            <SimpleIconButton title="Compare">
              <CompareIcon size={ 20 } />
            </SimpleIconButton>
            <div className="PopoverMenu">
              { compareModes.map(item =>(
                <a
                  key={item.value}
                  className={ classNames({ 'active': mode === item.value }) }
                  onClick={ () => changeMode(item.value, revisions) }
                >
                  Compare: { item.text }
                </a>
              ))}
            </div>
          </Popover> }
        { enablePreview &&
          <SimpleIconButton
            title="Open File"
            name="fileRoute"
            params={ {
              projectId: file1.project._id,
              fileId: file1.fileId,
            } }
          >
            <MdOpenInNew size={ 23 } />
          </SimpleIconButton> }
      </div>
    )
  }
})


function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

