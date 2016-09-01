// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileCompare.css'

// Sub Components
import PreviewFile from 'app/renderer/main/containers/PreviewFile';
import FileCompareSlider from './components/FileCompareSlider.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import {MdMoreHoriz} from 'react-icons/lib/md';

import {getCompareModes} from './FileCompare.utils.js';
import {getViewerType} from 'app/renderer/main/components/PreviewFile/previewFileUtils.js';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      position: 50,
      compareMode: 'single'
    };
  },
  sliderChange (position){
    this.setState({position: position});

  },
  changeFn(event){
    this.setState({position: event.target.value});
  },
  setCompareMode(compareMode){
    this.setState({compareMode: compareMode});
  },
  displayFileInfo(){
    console.log('fileInfo');
  },
  render() {
    const {project, file1, file2} = this.props;
    const previewType1 = getViewerType(file1.extension, project.remote.provider);
    const previewType2 = file2 ? getViewerType(file2.extension, project.remote.provider) : null;

    const compareModeClasses = {
      sideBySide    : 'layout-row',
      aboveAndBelow : 'layout-column',
      onion         : 'layout-row',
      slider        : 'layout-row',
      single        : 'layout-row',
    }

    const preview2Style = {
      sideBySide    : {},
      aboveAndBelow : {},
      onion         : {
        opacity     : this.state.position/100
      },
      slider        : {
        width       : this.state.position + '%'
      },
      single        : {}
    }

    const overylayStyles = this.state.compareMode == 'slider' && this.refs.container ?
          {width: this.refs.container.offsetWidth + 'px'} : {};

    console.log(this.props.children);

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{file1.path}</div>
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px"/>
            </SimpleIconButton>
            <div className="PopoverMenu">
              {getCompareModes(previewType1, previewType2).map((item)=><a className={classNames({'active': this.state.compareMode == item.value})} onClick={()=>this.setCompareMode(item.value)}>Compare: {item.text}</a>)}
              <div className="divider"></div>
              <a onClick={this.displayFileInfo}>Discard Changes</a>
              <a onClick={this.displayFileInfo}>Open in explorer</a>
              <a onClick={this.displayFileInfo}>File Info</a>
            </div>
          </PopoverMenu>
        </div>
        <div className={classNames('flex', 'rel-box', 'scroll-box', compareModeClasses[this.state.compareMode], classes[this.state.compareMode])} ref="container">
          <div className={classes.preview1 + ' flex layout-column'}>
            {this.state.compareMode != 'single' ? this.props.children[0] : ''}
          </div>
          {this.state.compareMode == 'slider' ? <FileCompareSlider container={this.refs.container} changeFn={this.sliderChange} position={this.state.position}/> : ''}
          <div className={classes.preview2 + ' flex layout-column'} style={preview2Style[this.state.compareMode]}>
            <div className="layout-column flex" style={overylayStyles}>
              {this.props.children[1]}
            </div>
          </div>
        </div>
        {this.state.compareMode == 'onion'
          ? <div className={classes.rangeSlider+ ' layout-row'}>
              <input className="flex" type="range" min="0" max="100" step="0.1" style={{cursor: 'move'}} onChange={this.changeFn}/>
            </div>
          : ''
        }
      </div>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

