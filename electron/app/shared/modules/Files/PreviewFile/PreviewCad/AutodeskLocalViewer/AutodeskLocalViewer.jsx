import React from 'react';
import classes from './AutodeskLocalViewer.css';
import autodeskViewerUtils from '../PreviewCadViewer.utils.js';

export default React.createClass({
  viewer: null,
  onMount (nextProps, prevProps) {
    this.viewer = autodeskViewerUtils.register(this.refs.cadCanvas);
    const filePath = `${nextProps.path}/1/model.svf`;
    const options = {
      'env' : 'Local',
      'document' : `file://${filePath}`
    };
    Autodesk.Viewing.Initializer(options, () => {
      this.viewer.start(options.document, options);
    });
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillUnmount(){
    autodeskViewerUtils.deregister(this.viewer);
  },
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"></div>
  }
});
