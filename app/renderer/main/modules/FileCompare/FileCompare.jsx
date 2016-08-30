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


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      position: 50,
      compareMode: 'sideBySide'
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
    const {project, file} = this.props;


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


    const compareModeInfo = [
      {
        value: 'sideBySide',
        text: 'Side By Side',
      }, {
        value: 'aboveAndBelow',
        text: 'Above and Below',
      }, {
        value: 'onion',
        text: 'Onion Skin',
      }, {
        value: 'slider',
        text: 'Slider',
      }, {
        value: 'single',
        text: 'None',
      }
    ]

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{file.path}</div>
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px"/>
            </SimpleIconButton>
            <div className="PopoverMenu">
              {compareModeInfo.map((item)=><a className={classNames({'active': this.state.compareMode == item.value})} onClick={()=>this.setCompareMode(item.value)}>Compare: {item.text}</a>)}
              <div className="divider"></div>
              <a onClick={this.displayFileInfo}>Discard Changes</a>
              <a onClick={this.displayFileInfo}>Open in explorer</a>
              <a onClick={this.displayFileInfo}>File Info</a>
            </div>
          </PopoverMenu>
        </div>
        <div className={classNames('flex', 'rel-box', compareModeClasses[this.state.compareMode], classes[this.state.compareMode])} ref="container">
          <div className={classes.preview1 + ' flex layout-column'}>
            <PreviewFile project={project} file={file} />
          </div>
          {this.state.compareMode == 'slider'
            ? <FileCompareSlider container={this.refs.container} changeFn={this.sliderChange} position={this.state.position}/>
            : ''
          }
          <div className={classes.preview2 + ' flex layout-column'} style={preview2Style[this.state.compareMode]}>
            <PreviewFile project={project} file={file} />
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

