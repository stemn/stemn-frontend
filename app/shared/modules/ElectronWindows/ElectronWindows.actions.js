import getUuid from '../../helpers/getUuid.js';

export function create({type, props}) {
  return {
    type: 'ELECTRON_WINDOWS/CREATE',
    payload: {
      id: getUuid(),
      type,
      props
    }
  }
}

export function parse() {
  return {
    type: 'ELECTRON_WINDOWS/PARSE',
    payload: {}
  }
}
