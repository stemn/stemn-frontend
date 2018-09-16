import * as cn from 'classnames'
import 'javascript-detect-element-resize'
import * as React from 'react'
import { IFileCompareMode } from 'stemn-shared/misc/FileCompare/types'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { PreviewFile } from 'stemn-shared/misc/Files/PreviewFile'
import * as classes from './FileCompareInner.scss'
import FileCompareSlider from './FileCompareSlider/FileCompareSlider.jsx'

const windowWithResizeListener = window as any

export interface IFileCompareInnerProps {
  editActive?: boolean,
  file1: IFile,
  file2?: IFile,
  event?: any,
  mode: IFileCompareMode,
  header?: boolean,
  className?: string,
}

export interface IFileCompareInnerState {
  position: number,
  width: number,
}

export class FileCompareInner extends React.Component<IFileCompareInnerProps, IFileCompareInnerState> {
  public containerRef?: HTMLDivElement
  constructor (props) {
    super(props)
    this.state = {
      position: 50,
      width: 0,
    }
  }
  public updateDimensions = () => {
    if (this.containerRef) {
      this.setState({ width: this.containerRef.offsetWidth })
    }
  }
  public componentWillUnmount () {
    windowWithResizeListener.removeResizeListener(this.refs.container, this.updateDimensions)
  }
  public sliderChange = (position) => {
    this.setState({ position })
  }
  public changeFn = (event) => {
    this.setState({ position: event.target.value })
  }
  public getContainerRef = (ref: HTMLDivElement) => {
    if (ref) {
      this.containerRef = ref
      windowWithResizeListener.addResizeListener(this.containerRef, this.updateDimensions)
      this.updateDimensions()
    }
  }
  public render () {
    const {
      editActive,
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
        className={`${classes.preview1} flex layout-column`}
        style={preview2Style[mode]}
      >
        <div
          className='layout-column flex'
          style={overylayStyles}
        >
          { file2 &&
            <PreviewFile
              file={file2}
              event={event}
              header={header}
            />
          }
        </div>
      </div>
    )

    const filePreview2 = () => {
      if (file1) {
        return (
          <div className={`${classes.preview2} flex layout-column`}>
            { file1 &&
              <PreviewFile
                file={file1}
                event={event}
                header={header}
                editActive={editActive}
              /> }
          </div>
        )
      }
    }

    return (
      <div className='layout-column flex'>
        <div className={cn('flex', 'rel-box', 'scroll-box', compareModeClasses[mode], classes[mode])} ref={this.getContainerRef}>
          {filePreview1()}
          { mode === 'slider' &&
            <FileCompareSlider
              container={this.refs.container}
              changeFn={this.sliderChange}
              position={this.state.position}
            /> }
          {filePreview2()}
        </div>
        { mode === 'onion' &&
          <div className={`${classes.rangeSlider} layout-row`}>
            <input
              className='flex'
              type='range'
              min='0'
              max='100'
              step='0.1'
              style={{ cursor: 'move' }}
              onChange={this.changeFn}
            />
          </div> }
      </div>
    )
  }
}
