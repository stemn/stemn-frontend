// Port of react-popover 0.5.10 (MIT) source/index.js without findDOMNode.
//
// Differences from the original:
// - The trigger (children) is rendered inside a `display: contents` <span> so we can
//   get a DOM reference without findDOMNode. The first element child of that span is
//   measured as the popover target.
// - Element resize detection uses ResizeObserver; vendor prefixing and debug logging removed.
import React from 'react'
import { createPortal } from 'react-dom'
import { throttle } from 'lodash'
import Layout from './layout'
import Tip from './Tip.jsx'

const isClient = typeof window !== 'undefined'
const noop = () => undefined

const coreStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
}

const faces = {
  above: 'down',
  right: 'left',
  below: 'up',
  left: 'right',
}

const flowToTipTranslations = {
  row: 'translateY',
  column: 'translateX',
}

const flowToPopoverTranslations = {
  row: 'translateX',
  column: 'translateY',
}

const targetStyle = { display: 'contents' }

export default class PopoverCore extends React.Component {
  static defaultProps = {
    tipSize: 7,
    preferPlace: null,
    place: null,
    offset: 4,
    isOpen: false,
    onOuterAction: noop,
    enterExitTransitionDurationMs: 500,
    children: null,
    refreshIntervalMs: 200,
  }

  constructor(props) {
    super(props)
    this.state = {
      standing: 'above',
      exited: !props.isOpen, // for animation-dependent rendering, should popover close/open?
      exiting: false, // for tracking in-progress animations
      toggle: props.isOpen || false, // for business logic tracking, should popover close/open?
    }
  }

  componentDidMount() {
    if (this.props.isOpen) this.enter()
  }

  UNSAFE_componentWillReceiveProps(propsNext) {
    const willOpen = !this.props.isOpen && propsNext.isOpen
    const willClose = this.props.isOpen && !propsNext.isOpen
    if (willOpen) this.open()
    else if (willClose) this.close()
  }

  componentDidUpdate(propsPrev, statePrev) {
    const didOpen = !statePrev.toggle && this.state.toggle
    const didClose = statePrev.toggle && !this.state.toggle
    if (didOpen) this.enter()
    else if (didClose) this.exit()
  }

  componentWillUnmount() {
    this.unmounted = true
    clearTimeout(this.exitingAnimationTimer1)
    clearTimeout(this.exitingAnimationTimer2)
    if (this.hasTracked) this.untrackPopover()
  }

  getTargetEl() {
    const wrapper = this.targetWrapperEl
    if (!wrapper) return null
    return wrapper.firstElementChild || wrapper
  }

  calcTargetBounds() {
    const wrapper = this.targetWrapperEl
    const el = this.getTargetEl()
    if (el && el !== wrapper) return Layout.El.calcBounds(el)
    // No element child (e.g. a text node) - measure the contents of the wrapper
    if (wrapper && document.createRange) {
      const range = document.createRange()
      range.selectNodeContents(wrapper)
      const b = range.getBoundingClientRect()
      return { x: b.left, y: b.top, x2: b.right, y2: b.bottom, w: b.right - b.left, h: b.bottom - b.top }
    }
    return { x: 0, y: 0, x2: 0, y2: 0, w: 0, h: 0 }
  }

  resolvePopoverLayout() {
    if (!this.containerEl || !this.bodyEl || !this.tipEl) return

    const pickerSettings = {
      preferPlace: this.props.preferPlace,
      place: this.props.place,
    }

    /* See react-popover issue 18: the tip changes the size when the flow changes. */
    if (this.zone) this.size[this.zone.flow === 'row' ? 'h' : 'w'] += this.props.tipSize
    const zone = Layout.pickZone(pickerSettings, this.frameBounds, this.targetBounds, this.size)
    if (this.zone) this.size[this.zone.flow === 'row' ? 'h' : 'w'] -= this.props.tipSize

    const tb = this.targetBounds
    this.zone = zone

    if (this.state.standing !== zone.standing) {
      this.setState({ standing: zone.standing })
    }

    const axis = Layout.axes[zone.flow]

    const dockingEdgeBufferLength = Math.round(getComputedStyle(this.bodyEl).borderRadius.slice(0, -2)) || 0
    const scrollSize = Layout.El.calcScrollSize(this.frameEl)
    scrollSize.main = scrollSize[axis.main.size]
    scrollSize.cross = scrollSize[axis.cross.size]

    const pos = Layout.calcRelPos(zone, tb, this.size)

    /* Offset allows users to control the distance betweent the tip and the target. */
    pos[axis.main.start] += this.props.offset * zone.order

    const frameBuffer = this.props.tipSize + this.props.offset
    const hangingBufferLength = dockingEdgeBufferLength * 2 + this.props.tipSize * 2 + frameBuffer
    const frameCrossStart = this.frameBounds[axis.cross.start]
    const frameCrossEnd = this.frameBounds[axis.cross.end]
    const frameCrossLength = this.frameBounds[axis.cross.size]
    const frameCrossInnerLength = frameCrossLength - frameBuffer * 2
    const frameCrossInnerStart = frameCrossStart + frameBuffer
    const frameCrossInnerEnd = frameCrossEnd - frameBuffer
    const popoverCrossStart = pos[axis.cross.start]
    const popoverCrossEnd = pos[axis.cross.end]

    if (pos.crossLength > frameCrossLength) {
      pos[axis.cross.start] = 0
    } else if (tb[axis.cross.end] < hangingBufferLength) {
      pos[axis.cross.start] = tb[axis.cross.end] - hangingBufferLength
    } else if (tb[axis.cross.start] > frameCrossInnerEnd) {
      pos[axis.cross.start] = tb[axis.cross.start] - this.size[axis.cross.size]
    } else if (pos.crossLength > frameCrossInnerLength) {
      pos[axis.cross.start] = (frameCrossLength - pos.crossLength) / 2
    } else if (popoverCrossStart < frameCrossInnerStart) {
      pos[axis.cross.start] = frameCrossInnerStart
    } else if (popoverCrossEnd > frameCrossInnerEnd) {
      pos[axis.cross.start] = pos[axis.cross.start] - (pos[axis.cross.end] - frameCrossInnerEnd)
    }

    /* Factor in the frame scroll position to get the absolute position */
    pos[axis.cross.start] += scrollSize.cross
    pos[axis.main.start] += scrollSize.main

    this.containerEl.style.flexFlow = zone.flow
    this.bodyEl.style.order = zone.order

    this.containerEl.style.top = `${pos.y}px`
    this.containerEl.style.left = `${pos.x}px`

    let tipCrossPos =
      Layout.centerOfBoundsFromBounds(zone.flow, 'cross', tb, pos) + scrollSize.cross - this.props.tipSize

    if (tipCrossPos < dockingEdgeBufferLength) {
      tipCrossPos = dockingEdgeBufferLength
    } else if (tipCrossPos > pos.crossLength - dockingEdgeBufferLength - this.props.tipSize * 2) {
      tipCrossPos = pos.crossLength - dockingEdgeBufferLength - this.props.tipSize * 2
    }

    this.tipEl.style.transform = `${flowToTipTranslations[zone.flow]}(${tipCrossPos}px)`
  }

  checkTargetReposition = () => {
    if (this.measureTargetBounds()) this.resolvePopoverLayout()
  }

  measurePopoverSize() {
    this.size = Layout.El.calcSize(this.containerEl)
  }

  measureTargetBounds() {
    const newTargetBounds = this.calcTargetBounds()
    if (this.targetBounds && Layout.equalCoords(this.targetBounds, newTargetBounds)) {
      return false
    }
    this.targetBounds = newTargetBounds
    return true
  }

  measureFrameBounds() {
    this.frameBounds = Layout.El.calcBounds(this.frameEl)
  }

  open() {
    if (this.state.exiting) this.animateExitStop()
    this.setState({ toggle: true, exited: false })
  }

  close() {
    this.setState({ toggle: false })
  }

  enter() {
    if (!isClient || !this.containerEl) return
    this.trackPopover()
    this.animateEnter()
  }

  exit() {
    this.animateExit()
    this.untrackPopover()
  }

  animateExitStop() {
    clearTimeout(this.exitingAnimationTimer1)
    clearTimeout(this.exitingAnimationTimer2)
    this.setState({ exiting: false })
  }

  animateExit() {
    this.setState({ exiting: true })
    this.exitingAnimationTimer2 = setTimeout(() => {
      if (this.containerEl && this.zone) {
        this.containerEl.style.transform = `${flowToPopoverTranslations[this.zone.flow]}(${this.zone.order * 50}px)`
        this.containerEl.style.opacity = '0'
      }
    }, 0)
    this.exitingAnimationTimer1 = setTimeout(() => {
      if (!this.unmounted) this.setState({ exited: true, exiting: false })
    }, this.props.enterExitTransitionDurationMs)
  }

  animateEnter() {
    if (!this.containerEl || !this.zone) return
    /* Prepare `entering` style so that we can then animate it toward `entered`. */
    this.containerEl.style.transform = `${flowToPopoverTranslations[this.zone.flow]}(${this.zone.order * 50}px)`
    this.containerEl.style.opacity = '0'

    /* Force a reflow so the transition starts from the entering style */
    void this.containerEl.offsetHeight

    if (this.props.enterExitTransitionDurationMs) {
      this.tipEl.style.transition = 'transform 150ms ease-in'
    }
    this.containerEl.style.transitionProperty = 'top, left, opacity, transform'
    this.containerEl.style.transitionDuration = `${this.props.enterExitTransitionDurationMs}ms`
    this.containerEl.style.transitionTimingFunction = 'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
    this.containerEl.style.opacity = '1'
    this.containerEl.style.transform = 'translateY(0)'
  }

  trackPopover() {
    if (this.hasTracked) this.untrackPopover()
    const minRefreshIntervalMs = 200

    this.bodyEl = this.containerEl.querySelector('.Popover-body')
    this.tipEl = this.containerEl.querySelector('.Popover-tip')
    this.frameEl = window
    this.hasTracked = true

    /* There is no way to know if the target moved without polling. */
    if (this.props.refreshIntervalMs) {
      this.checkLayoutInterval = setInterval(this.checkTargetReposition, this.props.refreshIntervalMs)
    }

    this.onFrameScrollThrottled = throttle(this.onFrameScroll, minRefreshIntervalMs)
    this.onFrameResizeThrottled = throttle(this.onFrameResize, minRefreshIntervalMs)
    this.onPopoverResizeThrottled = throttle(this.onPopoverResize, minRefreshIntervalMs)
    this.onTargetResizeThrottled = throttle(this.onTargetResize, minRefreshIntervalMs)

    // Capture so scrolling of any scroll container (not just the window) repositions
    window.addEventListener('scroll', this.onFrameScrollThrottled, true)
    window.addEventListener('resize', this.onFrameResizeThrottled)

    if (typeof ResizeObserver !== 'undefined') {
      this.popoverResizeObserver = new ResizeObserver(() => this.onPopoverResizeThrottled())
      this.popoverResizeObserver.observe(this.containerEl)
      const targetEl = this.getTargetEl()
      if (targetEl && targetEl !== this.targetWrapperEl) {
        this.targetResizeObserver = new ResizeObserver(() => this.onTargetResizeThrottled())
        this.targetResizeObserver.observe(targetEl)
      }
    }

    /* Anything that occurs _outside_ the Popover boundaries should close the Popover. */
    document.addEventListener('mousedown', this.checkForOuterAction)
    document.addEventListener('touchstart', this.checkForOuterAction)

    /* Kickstart layout at first boot. */
    this.measurePopoverSize()
    this.measureFrameBounds()
    this.measureTargetBounds()
    this.resolvePopoverLayout()
  }

  checkForOuterAction = (event) => {
    const inContainer = this.containerEl && this.containerEl.contains(event.target)
    const inTarget = this.targetWrapperEl && this.targetWrapperEl.contains(event.target)
    if (!inContainer && !inTarget) this.props.onOuterAction(event)
  }

  untrackPopover() {
    clearInterval(this.checkLayoutInterval)
    window.removeEventListener('scroll', this.onFrameScrollThrottled, true)
    window.removeEventListener('resize', this.onFrameResizeThrottled)
    ;[
      this.onFrameScrollThrottled,
      this.onFrameResizeThrottled,
      this.onPopoverResizeThrottled,
      this.onTargetResizeThrottled,
    ].forEach((fn) => fn && fn.cancel())
    if (this.popoverResizeObserver) this.popoverResizeObserver.disconnect()
    if (this.targetResizeObserver) this.targetResizeObserver.disconnect()
    this.popoverResizeObserver = undefined
    this.targetResizeObserver = undefined
    document.removeEventListener('mousedown', this.checkForOuterAction)
    document.removeEventListener('touchstart', this.checkForOuterAction)
    this.hasTracked = false
  }

  onTargetResize = () => {
    if (!this.hasTracked) return
    this.measureTargetBounds()
    this.resolvePopoverLayout()
  }

  onPopoverResize = () => {
    if (!this.hasTracked || !this.containerEl) return
    this.measurePopoverSize()
    this.resolvePopoverLayout()
  }

  onFrameScroll = () => {
    if (!this.hasTracked) return
    this.measureTargetBounds()
    this.resolvePopoverLayout()
  }

  onFrameResize = () => {
    if (!this.hasTracked) return
    this.measureFrameBounds()
    this.resolvePopoverLayout()
  }

  getContainerNodeRef = (containerEl) => {
    this.containerEl = containerEl
  }

  getTargetWrapperRef = (el) => {
    this.targetWrapperEl = el
  }

  render() {
    const { className = '', style = {}, tipSize, appendTarget } = this.props
    const { standing } = this.state

    const popover = this.state.exited ? null : (
      <div
        ref={this.getContainerNodeRef}
        className={`Popover Popover-${standing} ${className}`}
        style={{ ...coreStyle, ...style }}
      >
        <div className="Popover-body">{this.props.body}</div>
        <Tip direction={faces[standing]} size={tipSize} />
      </div>
    )

    return (
      <>
        <span ref={this.getTargetWrapperRef} style={targetStyle}>
          {this.props.children}
        </span>
        {isClient && popover && createPortal(popover, appendTarget || document.body)}
      </>
    )
  }
}
