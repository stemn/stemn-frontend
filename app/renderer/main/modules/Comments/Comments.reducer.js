import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  data: {},
  tasks: {}
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'COMMENTS/GET_COMMENTS':
      const responseData = {};
      action.payload.response.data.forEach((item)=>{
        responseData[item._id] = {data: item};
      });

      return i.merge(state, {
        data: responseData,
        tasks: {
          [action.meta.taskId] : {}
        }
      })
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'comments')(state, action)
}
