// Local replacement for react-clickdrag (which relies on findDOMNode).
//
// Same contract as react-clickdrag 3/4: `clickDrag(Component, opts)` returns a
// component which passes a `dataDrag` prop to `Component`:
//   { isMouseDown, isMoving, mouseDownPositionX, mouseDownPositionY, moveDeltaX, moveDeltaY }
// plus anything returned by `opts.getSpecificEventData(event)`.
//
// Extras (used by stemn call sites):
//   id     - incrementing id of the latest move event (unique per mousemove)
//   deltaX - X movement since the previous move event
//   deltaY - Y movement since the previous move event
//
// Options: touch, resetOnSpecialKeys, getSpecificEventData, onDragStart, onDragStop, onDragMove
//
// The wrapped component is rendered inside a `display: contents` element so no
// extra box is generated; mousedown/touchstart events bubble up to it.
import React from 'react'

const noop = () => {}

let eventIdCounter = 0

export default function clickDrag(Component, opts = {}) {
  const touch = opts.touch || false
  const resetOnSpecialKeys = opts.resetOnSpecialKeys || false
  const getSpecificEventData = opts.getSpecificEventData || (() => ({}))
  const onDragStart = opts.onDragStart || noop
  const onDragStop = opts.onDragStop || noop
  const onDragMove = opts.onDragMove || noop

  class ClickDrag extends React.Component {
    state = {
      isMouseDown: false,
      isMoving: false,
      mouseDownPositionX: 0,
      mouseDownPositionY: 0,
      moveDeltaX: 0,
      moveDeltaY: 0,
      id: undefined,
      deltaX: 0,
      deltaY: 0,
    }

    wasUsingSpecialKeys = false
    lastX = 0
    lastY = 0
    isMouseDown = false

    componentDidMount() {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
      if (touch) {
        document.addEventListener('touchmove', this.onMouseMove)
        document.addEventListener('touchend', this.onMouseUp)
      }
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
      if (touch) {
        document.removeEventListener('touchmove', this.onMouseMove)
        document.removeEventListener('touchend', this.onMouseUp)
      }
    }

    onMouseDown = (e) => {
      // only left mouse button
      if (touch || e.button === 0) {
        const pt = (e.changedTouches && e.changedTouches[0]) || e
        this.setMousePosition(pt.clientX, pt.clientY)
        onDragStart(e.nativeEvent || e)
      }
    }

    onMouseUp = (e) => {
      if (this.isMouseDown) {
        this.isMouseDown = false
        this.setState({
          isMouseDown: false,
          isMoving: false,
        })
        onDragStop(e)
      }
    }

    onMouseMove = (e) => {
      if (this.isMouseDown) {
        const pt = (e.changedTouches && e.changedTouches[0]) || e
        const isUsingSpecialKeys = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
        if (resetOnSpecialKeys && this.wasUsingSpecialKeys !== isUsingSpecialKeys) {
          this.wasUsingSpecialKeys = isUsingSpecialKeys
          this.setMousePosition(pt.clientX, pt.clientY)
        } else {
          const deltaX = pt.clientX - this.lastX
          const deltaY = pt.clientY - this.lastY
          this.lastX = pt.clientX
          this.lastY = pt.clientY
          eventIdCounter += 1
          this.setState(state => ({
            isMoving: true,
            moveDeltaX: pt.clientX - state.mouseDownPositionX,
            moveDeltaY: pt.clientY - state.mouseDownPositionY,
            id: eventIdCounter,
            deltaX,
            deltaY,
            ...getSpecificEventData(e),
          }))
        }
        onDragMove(e)
      }
    }

    setMousePosition(x, y) {
      this.isMouseDown = true
      this.lastX = x
      this.lastY = y
      this.setState({
        isMouseDown: true,
        isMoving: false,
        mouseDownPositionX: x,
        mouseDownPositionY: y,
        moveDeltaX: 0,
        moveDeltaY: 0,
        deltaX: 0,
        deltaY: 0,
      })
    }

    render() {
      return (
        <div
          style={ { display: 'contents' } }
          onMouseDown={ this.onMouseDown }
          onTouchStart={ touch ? this.onMouseDown : undefined }
        >
          <Component { ...this.props } dataDrag={ this.state } />
        </div>
      )
    }
  }

  ClickDrag.displayName = `ClickDrag(${Component.displayName || Component.name || 'Component'})`

  return ClickDrag
}
