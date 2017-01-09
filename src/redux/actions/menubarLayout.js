export function toggleSidebar(status) {
  return {
      type:'MENUBAR_LAYOUT/TOGGLE_SIDEBAR',
      payload: status // If status exists, we set, otherwise we toggle
  }
}
