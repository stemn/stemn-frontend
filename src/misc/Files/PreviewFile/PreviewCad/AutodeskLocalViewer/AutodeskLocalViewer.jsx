import React from 'react';
import classes from './AutodeskLocalViewer.css';
import autodeskViewerUtils from '../PreviewCadViewer.utils.js';

//import trhee    from 'stemn-shared/assets/other/autodesk/viewer/three.min.js';
//import autodesk from 'stemn-shared/assets/other/autodesk/viewer/viewer3d.min.js';
//console.log(autodesk);

export default React.createClass({
  viewer: null,
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.path != prevProps.path){
      // deregister the viewer if it already exists.
      if(this.viewer && this.viewer.deregister){
        this.viewer.deregister();
      }
      console.log(nextProps.path);
      this.viewer = autodeskViewerUtils.register(this.refs.cadCanvas, nextProps.linkKey);
      const filePath = `${nextProps.path}/1/model.svf`;
      const options = {
        'env' : 'Local',
//        'document' : `http://developer-autodesk.github.io/translated-models/shaver/0.svf`
//        'document' : `http://35.167.249.144/api/v1/sync/downloadRenderFile/5897e9418960f33210dd416c/5897e945b7333c08b6690475/5897e945b7333c08b6690474/1/model.svf?jacson=hello`
        'document' : `file://${filePath}`
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
