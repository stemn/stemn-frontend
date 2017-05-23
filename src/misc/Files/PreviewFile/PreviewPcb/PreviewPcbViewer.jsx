import React, { Component } from 'react'

import { clone, forEachRight, find, has } from 'lodash'
import { deregister, register, activeInstances } from './PreviewPcb.utils'

import classes from './PreviewPcb.css';

export default class PreviewPcbViewer extends Component {
  state = {
    flipped: null,
  }
  viewerInstance = null
  componentDidMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)}
  onMount = (nextProps, prevProps) => {
    if(!prevProps || (nextProps.data != prevProps.data && nextProps.name != prevProps.name)){
      setTimeout(this.init(nextProps), 1); // Timeout so refs can init
    }
  }
  componentWillUnmount(){
    deregister(this.viewerInstance);
  }
  init = (props) => {
    const { data, name } = props;

    // Deregister any existing viewers
    if(this.viewerInstance){
      deregister(this.viewerInstance);
    }

    const file = {
      name: name,
      data: data
    };

    this.viewerInstance = register();
    const layers = [file].map(this.viewerInstance.parse);
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

      this.viewerInstance.init(layers, this.refs.canvas, activeInstances);
      // Flip the board if we only have bottom layers
      if(!find(layers, 'side', 2)){
        this.flip(true);
      }
    }
    else{
      previewer.type = 'other';
    }
  }
  flip = (status) => {
    const flipped = status ? status : !this.state.flipped;
    this.setState({flipped: flipped})
    activeInstances.forEach(instance => {
      instance.flip(flipped);
    })
  }
  render() {
    return <div ref="canvas" className={ classes.canvas + ' layout-column flex' } />
  }
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
