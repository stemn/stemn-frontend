import React, { Component } from 'react'
import 'javascript-detect-element-resize' // addResizeListener && removeResizeListener
import cn from 'classnames'
import classes from './FileCompareInner.css'
import PreviewFile from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.jsx'
import FileCompareSlider from './FileCompareSlider/FileCompareSlider.jsx'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default class FileCompareInner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 50,
      width: 0,
    }
  }
  updateDimensions = () => {
    if (this.refs.container) {
      this.setState({ width: this.refs.container.offsetWidth })
    }
  }
  componentWillMount() {
    this.updateDimensions()
  }
  componentDidMount() {
    window.addResizeListener(this.refs.container, this.updateDimensions)
  }
  componentWillUnmount() {
    window.removeResizeListener(this.refs.container, this.updateDimensions)
  }
  sliderChange = (position) => {
    this.setState({ position })
  }
  changeFn = (event) => {
    this.setState({ position: event.target.value })
  }
  render() {
    const {
      project,
      file1,
      file2,
      event,
      mode,
      header,
    } = this.props
    const { width, position } = this.state
    
    const compareModeClasses = {
      sideBySide: 'layout-row',
      aboveAndBelow: 'layout-column',
      onion: 'layout-row',
      slider: 'layout-row',
      single: 'layout-row',
    }

    const preview2Style = {
      sideBySide: {},
      aboveAndBelow: {},
      onion: {
        opacity: position / 100,
      },
      slider: {
        width: `${position}%`,
      },
      single: {},
    }

    const overylayStyles = mode === 'slider' && this.refs.container
      ? { width: `${width}px` }
      : {}

    const filePreview1 = () => (
      <div
        className={ `${classes.preview1} flex layout-column` }
        style={ preview2Style[mode] }
      >
        <div
          className="layout-column flex"
          style={ overylayStyles }
        >
          { file2 &&
          <PreviewFile
            project={ project }
            file={ file2 }
            event={ event }
            header={ header }
          /> }
        </div>
      </div>
    )

    const filePreview2 = () => {
      if (file1) {
        return (
          <div className={ `${classes.preview2} flex layout-column` }>
            { file1 &&
              <PreviewFile
                project={ project }
                file={ file1 }
                event={ event }
                header={ header }
              /> }
          </div>
        )
      }
    }

    return (
      <div className="layout-column flex">
        <div className={ cn('flex', 'rel-box', 'scroll-box', compareModeClasses[mode], classes[mode]) } ref="container">
          { filePreview1() }
          { mode === 'slider' &&
            <FileCompareSlider
              container={ this.refs.container }
              changeFn={ this.sliderChange }
              position={ this.state.position }
            /> }
          { filePreview2() }
        </div>
        { mode === 'onion' &&
          <div className={ `${classes.rangeSlider} layout-row` }>
            <input
              className="flex"
              type="range"
              min="0"
              max="100"
              step="0.1"
              style={ { cursor: 'move' } }
              onChange={ this.changeFn }
            />
          </div> }
      </div>
    )
  }
}
