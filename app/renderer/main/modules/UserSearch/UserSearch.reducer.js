import {
  UPDATE_INPUT_VALUE,
  CLEAR_SUGGESTIONS
} from './UserSearch.actions.js'

const initialState = {
  value: '',
  suggestions: [],
  model: '',
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
    case 'USER_SEARCH/SELECT_SUGGESTION':
      console.log(action.payload.value);
      return {
        ...state
      };

    default:
      return state;
  }
}
