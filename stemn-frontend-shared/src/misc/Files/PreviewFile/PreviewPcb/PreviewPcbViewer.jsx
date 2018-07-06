import React, { Component } from 'react'

import { clone, forEachRight, find } from 'lodash'
import { deregister, register, activeInstances } from './PreviewPcb.utils'

import classes from './PreviewPcb.css'

export default class PreviewPcbViewer extends Component {
  state = {
    flipped: null,
  }
  viewerInstance = null
  componentDidMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }
  onMount = (nextProps, prevProps) => {
    if (!prevProps || (nextProps.layers !== prevProps.layers)) {
      setTimeout(this.init(nextProps), 1) // Timeout so refs can init
    }
  }
  componentWillUnmount() {
    deregister(this.viewerInstance)
  }
  init = (props) => {
    const { layers } = props

    // Deregister any existing viewers
    if (this.viewerInstance) {
      deregister(this.viewerInstance)
    }

    this.viewerInstance = register()
    const parsedLayers = layers.map(this.viewerInstance.parse)
    errorMessages(parsedLayers)

    // If we still have layers, display them
    if (parsedLayers.length > 0) {
      // Push on the back layer if it is a pcb/brd file
      if (!parsedLayers[0].isGerber) {
        parsedLayers[0].side = 2
        const backLayer = clone(parsedLayers[0], true)
        backLayer.boardFlipped = true
        backLayer.side = 1
        parsedLayers.push(backLayer)
      }

      this.viewerInstance.init(parsedLayers, this.refs.canvas, activeInstances)
      // Flip the board if we only have bottom layers
      if (!find(parsedLayers, 'side', 2)) {
        this.flip(true)
      }
    } else {
      //      previewer.type = 'other';
    }
  }
  flip = (status) => {
    const flipped = status || !this.state.flipped
    this.setState({ flipped })
    activeInstances.forEach((instance) => {
      instance.flip(flipped)
    })
  }
  render() {
    return <div ref="canvas" className={ `${classes.canvas} layout-column flex` } />
  }
}

function errorMessages(layers) {
  // Pop Error messages and remove bad layers
  forEachRight(layers, (layer, index) => {
    if (layer.error) {
      //      toast(layer.error);
      layers.splice(index, 1)
    } else if (layer.isGerber && layer.cmds.length === 0) {
      //      toast('Could not parse file.');
      layers.splice(index, 1)
    }
  })
}
