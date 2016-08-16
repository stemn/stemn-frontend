import http from 'axios';
export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';

export function loadSuggestions(value) {
  return {
    type:'FETCH_SUGGESTIONS',
    payload: http({
      url: 'https://stemn.com/api/v1/search',
      method: 'GET',
      params: {
        type:'user',
        key: 'name',
        value: value,
        size: 20,
        match: 'regex'
      },
    })
  }
}

export function updateInputValue(value) {
  return {
    type: UPDATE_INPUT_VALUE,
    payload: {
      value
    }
  };
}

export function clearSuggestions() {
  return {
    type: CLEAR_SUGGESTIONS
  };
}
