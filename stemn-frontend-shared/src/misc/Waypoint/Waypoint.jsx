import React, { Component } from 'react'

/**
 * Minimal replacement for `react-waypoint` (deprecated) built on IntersectionObserver.
 * Renders an empty sentinel element and calls onEnter / onLeave when it
 * enters / leaves the viewport.
 */
export default class Waypoint extends Component {
  componentDidMount() {
    if (typeof IntersectionObserver === 'undefined' || !this.el) return
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.props.onEnter) this.props.onEnter(entry)
          } else if (this.props.onLeave) {
            this.props.onLeave(entry)
          }
        })
      },
      { rootMargin: this.props.rootMargin || '0px' },
    )
    this.observer.observe(this.el)
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  render() {
    return (
      <span
        ref={(el) => {
          this.el = el
        }}
        style={{ display: 'block', fontSize: 0 }}
      />
    )
  }
}
