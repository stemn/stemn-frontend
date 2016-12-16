import React from 'react';
import classes from './AutodeskLocalViewer.css';
import http from 'axios';

export default React.createClass({
  onMount (nextProps, prevProps) {
    const viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.refs.cadCanvas);
    const filePath = "C:/Users/david/Downloads/53788-swivel-chairfbx/1/swivel-chair.svf";
    const options = {
      'env' : 'Local',
      'document' : `file://${filePath}`
    };
    Autodesk.Viewing.Initializer(options, function() {
      viewer.start(options.document, options);
    });
  },
  componentDidMount() { this.onMount(this.props) },
//  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"></div>
  }
});
