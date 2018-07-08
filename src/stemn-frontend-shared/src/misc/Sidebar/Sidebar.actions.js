export function toggleSidebar(status) {
  return {
    type: 'SIDEBAR/TOGGLE_SIDEBAR',
    payload: status, // If status exists, we set, otherwise we toggle
  }
}
export function toggleMenubarSidebar(status) {
  return {
    type: 'SIDEBAR/TOGGLE_MENUBAR_SIDEBAR',
    payload: status, // If status exists, we set, otherwise we toggle
  }
}
