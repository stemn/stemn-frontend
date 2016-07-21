/* eslint-disable no-param-reassign */
const initialState = {
  navMenu: [
    {
      name: 'Changes',
      path: '/'
    },{
      name: 'History',
      path: '/feed'
    },{
      name: 'Threads',
      path: '/threads'
    }
  ]
};

export default function job(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
