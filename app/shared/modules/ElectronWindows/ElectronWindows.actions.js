export function create({type, props}) {
  return {
    type: 'ELECTRON_WINDOWS/CREATE',
    payload: {
      type,
      props
    }
  }
}
