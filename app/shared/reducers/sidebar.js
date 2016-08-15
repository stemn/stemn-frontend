////import { modelReducer, formReducer, modeled } from 'react-redux-form';
////import { combineReducers } from 'redux'
//
//const initialState = {
//  fetching: false,
//  fetched: false,
//  projects: [],
//  error: null,
//
//  model: {
//    searchString: '',
//  },
//
//  show: true // shows the sidebar
//}
//
//
//export default (state = initialState, action) => {
//  const name = 'FETCH_PROJECTS'
//  switch (action.type) {
//      case name+ '_PENDING':
//        return {...state,
//          fetching: true
//        }
//      case name + '_FULFILLED':
//        return {...state,
//          fetching: false,
//          fetched: true,
//          projects: action.payload.data,
//        }
//      case name + '_REJECTED':
//        return {...state,
//          fetching: false,
//          error: action.payload
//        }
//      case 'TOGGLE_SIDEBAR':
//        return {...state,
//          show: action.payload || !state.show
//        }
//      default:
//        return state;
//  }
//}
//
////export default function (state = initialState, action) {
////  return {
////    model: modeled(CommitChanges, 'changes.model')(state.model, action),
////    form : formReducer('changes.form')(state.form, action)
////  }
////}


import { modelReducer, formReducer, modeled } from 'react-redux-form';

const initialState = {

  fetching: false,
  fetched: false,
  projects: [],
  error: null,
  searchString: '',

  show: true // shows the sidebar
}


const mainReducer = (state, action) => {
  const name = 'FETCH_PROJECTS'
  switch (action.type) {
      case name+ '_PENDING':
        return {...state,
          fetching: true
        }
      case name + '_FULFILLED':
        return {...state,
          fetching: false,
          fetched: true,
          projects: action.payload.data,
        }
      case name + '_REJECTED':
        return {...state,
          fetching: false,
          error: action.payload
        }
      case 'TOGGLE_SIDEBAR':
        return {...state,
          show: action.payload || !state.show
        }
      default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'sidebar')(state, action)
}
