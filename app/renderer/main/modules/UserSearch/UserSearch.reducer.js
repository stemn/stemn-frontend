import {
  UPDATE_INPUT_VALUE,
  CLEAR_SUGGESTIONS
} from './UserSearch.actions.js'

const initialState = {
  value: '',
  suggestions: [],
  isLoading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        value: action.payload.value
      };

    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      };

    case 'FETCH_SUGGESTIONS_PENDING':
      return {
        ...state,
        isLoading: true
      };

    case 'FETCH_SUGGESTIONS_FULFILLED':
      return {
        ...state,
        suggestions: action.payload.data,
        isLoading: false
      };

    default:
      return state;
  }
}
