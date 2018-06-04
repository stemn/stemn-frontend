export function activate({ name }) {
  return {
    type: 'WALKTHROUGH/ACTIVATE',
    payload: { name },
  }
}
export function deactivate({ name }) {
  return {
    type: 'WALKTHROUGH/DEACTIVATE',
    payload: { name },
  }
}
