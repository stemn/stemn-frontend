const initialState = {

}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'PROJECTS/GET_PROJECT_FULFILLED' :
      return {...state,
        [action.payload.data.stub] : action.payload.data
      }
    default:
        return state;
  }
}
