import React from 'react';
import classes from './AutodeskLocalViewer.css';
import http from 'axios';

export default React.createClass({
  onMount (nextProps, prevProps) {
    http({
      url: 'http://developer-autodesk.github.io/translated-models/shaver/0.svf',
      responseType: 'blob'
    }).then(response => {
      const viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.refs.cadCanvas);
      const filePath = "C:/Users/david/Downloads/viewer-javascript-offline.sample-gh-pages/viewer-javascript-offline.sample-gh-pages/shaver/0.svf"
      const options = {
        'env' : 'Local',
        'document' : `../../../../../../../../../${filePath}`
      };
//
      Autodesk.Viewing.Initializer(options, function() {
        viewer.start(options.document, options);
      });
    })
  },
  componentDidMount() { this.onMount(this.props) },
//  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"></div>
  }
});
