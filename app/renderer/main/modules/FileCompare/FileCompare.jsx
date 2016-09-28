// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileCompareActions from './FileCompare.actions.js';

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

const onMount = (nextProps, prevProps) => {
  if(!prevProps || nextProps.compareId !== prevProps.compareId){
    nextProps.fileCompareActions.init({
      compareId: nextProps.compareId,
      project: nextProps.project,
      file1: nextProps.file1,
      file2: nextProps.file2,
    })
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

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
    const {project, file1, file2, fileCompare, compareId} = this.props;
    if(!fileCompare){return null};

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

    const overylayStyles = fileCompare.mode == 'slider' && this.refs.container ?
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
          <div className={classes.preview2 + ' flex layout-column'} style={preview2Style[fileCompare.mode]}>
            <div className="layout-column flex" style={overylayStyles}>
              {file1 ? <PreviewFile project={project} file={file1} /> : ''}
            </div>
          </div>
        )
      }
    }

    return (
      <div className="layout-column flex">
        <div className={classNames('flex', 'rel-box', 'scroll-box', compareModeClasses[fileCompare.mode], classes[fileCompare.mode])} ref="container">
          {filePreview1()}
          {fileCompare.mode == 'slider' ? <FileCompareSlider container={this.refs.container} changeFn={this.sliderChange} position={this.state.position}/> : ''}
          {filePreview2()}
        </div>
        {fileCompare.mode == 'onion'
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

