
import { modeled } from 'react-redux-form';

const initialState = {
  permissions: 'public'
};

function reducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}


export default function (state = initialState, action) {
  return modeled(reducer, 'projectSettings')(state, action)
}
