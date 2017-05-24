import React from 'react'
import classes from './AutodeskLocalViewer.css'
import autodeskViewerUtils from '../PreviewCadViewer.utils.js'

export default React.createClass({
  viewer: null,
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.path != prevProps.path){
      // deregister the viewer if it already exists.
      if(this.viewer && this.viewer.deregister){
        this.viewer.deregister();
      }
      this.viewer = autodeskViewerUtils.register(this.refs.cadCanvas, nextProps.linkKey);
      const filePath = `${nextProps.path}/1/model.svf`;
      const filePathWithProtocol = filePath.includes('http://') ? filePath : `file://${filePath}`;
      const options = {
        'env' : 'Local',
        'document' : filePathWithProtocol
      };
      Autodesk.Viewing.Initializer(options, () => {
        this.viewer.start(options.document, options);
      });
    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillUnmount(){
    this.viewer.deregister();
  },
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"><div className={classes.scrollOverlay}></div></div>
  }
});
