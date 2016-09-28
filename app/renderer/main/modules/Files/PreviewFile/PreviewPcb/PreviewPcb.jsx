import React from 'react';
import { clone, forEachRight, find } from 'lodash';
import previewPcbService from './PreviewPcbService.js';
import classes from './PreviewPcb.css';

export const Viewer = React.createClass({
  render() {
    const { data, name } = this.props;
    if(data && name){
      setTimeout(()=>{init({element : this.refs.canvas,file : {name: name,data: data}})}, 1)
    }
    return <div ref="canvas" className={classes.canvas + ' layout-column flex'}></div>
  }
});

export default class extends React.Component{
  componentWillReceiveProps(nextProps, prevProps) {
    if(!nextProps.fileData){
      nextProps.downloadFn({
        projectId : nextProps.fileMeta.project._id,
        fileId : nextProps.fileMeta.fileId,
        revisionId : nextProps.fileMeta.revisionId
      })
    }
  }
  render() {
    const { fileData, fileMeta } = this.props;
    if(fileData && fileData.data){
      return <Viewer data={fileData.data} name={fileMeta.name} />
    }
    else{
      return <div>Pending</div>
    }
  }
};

function init({element, file}){
  const previewerInstance = previewPcbService.register();
  const layers = [file].map(previewerInstance.parse);
  errorMessages(layers);

  // If we still have layers, display them
  if(layers.length > 0){
      // Push on the back layer if it is a pcb/brd file
      if(!layers[0].isGerber){
          layers[0].side = 2;
          var backLayer = clone(layers[0], true);
          backLayer.boardFlipped = true;
          backLayer.side = 1;
          layers.push(backLayer);
      }

      previewerInstance.init(layers, element, previewPcbService.activeInstances);
      // Flip the board if we only have bottom layers
      if(!find(layers, 'side', 2)){
          flip(true);
      }
  }
  else{
      previewer.type = 'other';
  }

}

function flip(){

}

function errorMessages(layers){
  // Pop Error messages and remove bad layers
  forEachRight(layers, function(layer, index){
      if(layer.error){
        toast(layer.error);
        layers.splice(index, 1);
      }
      else if(layer.isGerber && layer.cmds.length === 0){
        toast('Could not parse file.');
        layers.splice(index, 1);
      }
  });
}
