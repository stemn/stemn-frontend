// ResizeObserver based replacement for `javascript-detect-element-resize`
// (window.addResizeListener / window.removeResizeListener)
const observers = new WeakMap()

export const addResizeListener = (element, callback) => {
  if (!element || typeof ResizeObserver === 'undefined') return
  const observer = new ResizeObserver(() => callback())
  observer.observe(element)
  const existing = observers.get(element) || new Map()
  existing.set(callback, observer)
  observers.set(element, existing)
}

export const removeResizeListener = (element, callback) => {
  const existing = element && observers.get(element)
  const observer = existing && existing.get(callback)
  if (observer) {
    observer.disconnect()
    existing.delete(callback)
  }
}
