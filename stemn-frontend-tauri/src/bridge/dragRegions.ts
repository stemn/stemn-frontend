/**
 * Frameless windows: Chromium honours `-webkit-app-region: drag` (TitleBar.module.css,
 * Header.module.css), WebKitGTK / WebView2 / WKWebView in Tauri don't. The drag regions are the
 * title bar and header "dragger" elements (CSS-module class names are `<File>_<class>-<hash>`):
 * a primary-button press on them starts a native window drag, a double click toggles maximise.
 * Links, buttons and inputs inside them stay clickable (`-webkit-app-region: no-drag` in the CSS).
 */
const DRAG_SELECTOR = '[class*="TitleBar_dragger"], [class*="Header_dragger"]'
const NO_DRAG_SELECTOR = 'a, button, input, textarea, select, [contenteditable], .no-drag'

export const isDragTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false
  if (target.closest(NO_DRAG_SELECTOR)) return false
  return !!target.closest(DRAG_SELECTOR)
}

export const installDragRegions = (command: (name: string) => Promise<unknown>) => {
  window.addEventListener(
    'mousedown',
    (event) => {
      if (event.button !== 0 || !isDragTarget(event.target)) return
      event.preventDefault()
      command(event.detail === 2 ? 'toggleMaximize' : 'startDragging').catch(() => {})
    },
    true,
  )
}
