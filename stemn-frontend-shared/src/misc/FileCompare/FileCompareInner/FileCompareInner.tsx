import cn from 'classnames'
import * as React from 'react'
import { isCadFile, isPcbFile } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import { IFileCompareMode } from 'stemn-shared/misc/FileCompare/types'
import DxfDiffLoader from 'stemn-shared/misc/FileDiff/DxfDiffLoader'
import FileDiffLoader from 'stemn-shared/misc/FileDiff/FileDiffLoader'
import PcbDiffLoader from 'stemn-shared/misc/FileDiff/PcbDiffLoader'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { PreviewFile } from 'stemn-shared/misc/Files/PreviewFile'
import { isDrawingFile } from 'stemn-shared/misc/Files/PreviewFile/PreviewCadOss/renderFormats'
import classes from './FileCompareInner.module.scss'
import FileCompareSlider from './FileCompareSlider/FileCompareSlider.jsx'

export interface IFileCompareInnerProps {
  editActive?: boolean
  file1: IFile
  file2?: IFile
  event?: any
  mode: IFileCompareMode
  header?: boolean
  className?: string
}

export interface IFileCompareInnerState {
  position: number
  width: number
}

export class FileCompareInner extends React.Component<IFileCompareInnerProps, IFileCompareInnerState> {
  public containerRef?: HTMLDivElement
  public resizeObserver?: ResizeObserver
  constructor(props) {
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
  public componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = undefined
    }
  }
  public sliderChange = (position) => {
    this.setState({ position })
  }
  public changeFn = (event) => {
    this.setState({ position: event.target.value })
  }
  public getContainerRef = (ref: HTMLDivElement) => {
    if (ref && ref !== this.containerRef) {
      this.containerRef = ref
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
      }
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.updateDimensions)
        this.resizeObserver.observe(ref)
      }
      this.updateDimensions()
    }
  }
  public render() {
    const { file1, file2, mode } = this.props

    // two revisions of a CAD file: the diff viewer (lazy chunk), unified or side by side with synchronised cameras;
    // 2D drawings (DXF, DWG) in the 2D diff viewer, without three.js. both fall back to the plain side-by-side
    // comparison below for formats the API cannot diff
    if (file1 && file2 && (mode === 'unified' || mode === 'sideBySide') && (isCadFile(file1) || isPcbFile(file1))) {
      // PCB and electronics files (KiCad, Eagle, Gerber, Excellon) in the same 2D diff viewer
      const DiffLoader = isPcbFile(file1) ? PcbDiffLoader : isDrawingFile(file1) ? DxfDiffLoader : FileDiffLoader
      return (
        <div className="layout-column flex">
          <DiffLoader file1={file1} file2={file2} view={mode} renderFallback={() => this.renderCompare('sideBySide')} />
        </div>
      )
    }

    // unified diffs are for CAD and PCB files; anything else in that mode is shown side by side
    return this.renderCompare(mode === 'unified' ? (file2 ? 'sideBySide' : 'single') : mode)
  }
  public renderCompare(mode: Exclude<IFileCompareMode, 'unified'>) {
    const { editActive, file1, file2, event, header } = this.props
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

    const overylayStyles = mode === 'slider' && this.containerRef ? { width: `${width}px` } : {}

    const filePreview1 = () => (
      <div className={`${classes.preview1} flex layout-column`} style={preview2Style[mode]}>
        <div className="layout-column flex" style={overylayStyles}>
          {file2 && <PreviewFile file={file2} event={event} header={header} />}
        </div>
      </div>
    )

    const filePreview2 = () => {
      if (file1) {
        return (
          <div className={`${classes.preview2} flex layout-column`}>
            {file1 && <PreviewFile file={file1} event={event} header={header} editActive={editActive} />}
          </div>
        )
      }
    }

    return (
      <div className="layout-column flex">
        <div
          className={cn('flex', 'rel-box', 'scroll-box', compareModeClasses[mode], classes[mode])}
          ref={this.getContainerRef}
        >
          {filePreview1()}
          {mode === 'slider' && (
            <FileCompareSlider
              container={this.containerRef}
              changeFn={this.sliderChange}
              position={this.state.position}
            />
          )}
          {filePreview2()}
        </div>
        {mode === 'onion' && (
          <div className={`${classes.rangeSlider} layout-row`}>
            <input
              className="flex"
              type="range"
              min="0"
              max="100"
              step="0.1"
              style={{ cursor: 'move' }}
              onChange={this.changeFn}
            />
          </div>
        )}
      </div>
    )
  }
}
