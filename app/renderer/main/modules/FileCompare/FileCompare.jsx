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
import PreviewFile        from 'app/renderer/main/modules/Files/PreviewFile/PreviewFile.jsx';
import FileCompareSlider  from './components/FileCompareSlider.jsx';
import FileCompareMenu    from './FileCompareMenu/FileCompareMenu.jsx'



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      position: 50,
    };
  },
  sliderChange (position){
    this.setState({position: position});
  },
  changeFn(event){
    this.setState({position: event.target.value});
  },
  displayFileInfo(){
    console.log('fileInfo');
  },
  render() {
    const {project, file1, file2, compareId, mode} = this.props;

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

    const overylayStyles = mode == 'slider' && this.refs.container ?
          {width: this.refs.container.offsetWidth + 'px'} : {};


    const filePreview1 = () => {
      return (
        <div className={classes.preview1 + ' flex layout-column'}>
          {file2 ? <PreviewFile project={project} file={file2} /> : ''}
        </div>
      )
    }

    const filePreview2 = () => {
      if(file1){
        return (
          <div className={classes.preview2 + ' flex layout-column'} style={preview2Style[mode]}>
            <div className="layout-column flex" style={overylayStyles}>
              {file1 ? <PreviewFile project={project} file={file1} /> : ''}
            </div>
          </div>
        )
      }
    }

    return (
      <div className="layout-column flex">
        <div className={classNames('flex', 'rel-box', 'scroll-box', compareModeClasses[mode], classes[mode])} ref="container">
          {filePreview1()}
          {mode == 'slider' ? <FileCompareSlider container={this.refs.container} changeFn={this.sliderChange} position={this.state.position}/> : ''}
          {filePreview2()}
        </div>
        {mode == 'onion'
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

