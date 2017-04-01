export default (token) => {
  return {
    type:'AUTH/SET_AUTH_TOKEN',
    payload: token
  }
}