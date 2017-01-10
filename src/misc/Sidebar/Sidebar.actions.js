export function toggleSidebar(status) {
  return {
      type:'SIDEBAR/TOGGLE_SIDEBAR',
      payload: status // If status exists, we set, otherwise we toggle
  }
}
