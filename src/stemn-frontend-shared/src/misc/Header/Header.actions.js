export function toggleUserMenu(status) {
  return {
    type: 'HEADER/TOGGLE_USER_MENU',
    payload: status, // If status exists, we set, otherwise we toggle
  }
}
