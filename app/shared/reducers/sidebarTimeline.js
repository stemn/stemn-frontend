const initialState = {
  timeline: [
    {
      _id: '1',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      data: {

      }
    }, {
      _id: '2',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      data: {

      }
    }, {
      _id: '3',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      data: {

      }
    }, {
      _id: '4',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      data: {

      }
    }
  ],
  selected: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SELECT_TIMELINE_ITEM':
          return {...state,
            selected: action.payload
          }
        default:
            return state;
    }
}
