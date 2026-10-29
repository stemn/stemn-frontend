// Minimal local replacement for react-flip-move (which relies on findDOMNode).
//
// Supported props: typeName, className, style, duration, easing, delay,
// enterAnimation ('fade' | 'none' | false), leaveAnimation (accepted but ignored -
// removed children disappear immediately), disableAllAnimations.
//
// Moves are animated with the FLIP technique. DOM nodes are resolved by position:
// each direct child is expected to render exactly one DOM element. If the number of
// DOM children does not match the number of React children, animation is skipped.
import React from 'react'

const getKeys = (children) =>
  React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child, idx) => (child.key != null ? child.key : `__idx_${idx}`))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default class FlipMove extends React.Component {
  static defaultProps = {
    typeName: 'div',
    duration: 350,
    easing: 'ease-in-out',
    delay: 0,
    enterAnimation: 'elevator',
    leaveAnimation: 'elevator',
    disableAllAnimations: false,
  }

  containerRef = React.createRef()

  getNodeMap(keys) {
    const container = this.containerRef.current
    if (!container || container.children.length !== keys.length) return null
    const map = {}
    keys.forEach((key, idx) => {
      map[key] = container.children[idx]
    })
    return map
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.disableAllAnimations || prefersReducedMotion()) return null
    const prevKeys = getKeys(prevProps.children)
    const nodes = this.getNodeMap(prevKeys)
    if (!nodes) return null
    const rects = {}
    prevKeys.forEach((key) => {
      rects[key] = nodes[key].getBoundingClientRect()
    })
    return { rects }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!snapshot) return
    const { duration, easing, delay, enterAnimation } = this.props
    const keys = getKeys(this.props.children)
    const nodes = this.getNodeMap(keys)
    if (!nodes) return
    const transition = `transform ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ${easing} ${delay}ms`

    keys.forEach((key) => {
      const node = nodes[key]
      if (!node || !node.style) return
      const prevRect = snapshot.rects[key]
      if (prevRect) {
        // Measure the final position without any in-flight animation transform
        if (node.__flipMoveTransform !== undefined) {
          node.style.transition = 'none'
          node.style.transform = node.__flipMoveTransform
        }
        const rect = node.getBoundingClientRect()
        const dx = prevRect.left - rect.left
        const dy = prevRect.top - rect.top
        if (!dx && !dy) return
        // Remember any inline transform the child set itself so we can restore it
        if (node.__flipMoveTransform === undefined) node.__flipMoveTransform = node.style.transform
        const baseTransform = node.__flipMoveTransform
        // Invert
        node.style.transition = 'none'
        node.style.transform = `translate(${dx}px, ${dy}px) ${baseTransform}`
        void node.offsetWidth // force a style flush so the inverted position is applied
        // Play
        requestAnimationFrame(() => {
          node.style.transition = transition
          node.style.transform = baseTransform
          this.cleanupAfter(node)
        })
      } else if (enterAnimation && enterAnimation !== 'none') {
        node.style.transition = 'none'
        node.style.opacity = '0'
        void node.offsetWidth
        requestAnimationFrame(() => {
          node.style.transition = transition
          node.style.opacity = ''
          this.cleanupAfter(node)
        })
      }
    })
  }

  cleanupAfter(node) {
    const { duration, delay } = this.props
    clearTimeout(node.__flipMoveTimeout)
    node.__flipMoveTimeout = setTimeout(() => {
      node.style.transition = ''
      node.__flipMoveTransform = undefined
    }, duration + delay)
  }

  render() {
    const { typeName, className, style, children } = this.props
    return React.createElement(typeName, { className, style, ref: this.containerRef }, children)
  }
}
