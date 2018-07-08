export const ctrlEnterHandler = (element, handler) => {
  element.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      handler()
    }
  })
}
