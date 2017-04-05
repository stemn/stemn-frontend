import i from 'icepick'

const initialState = {
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'LIKES/LIKE':
      return i.assocIn(state, [action.payload], true)
    case 'LIKES/UN_LIKE':
      return i.assocIn(state, [action.payload], false)
    default:
      return state;
  }
}