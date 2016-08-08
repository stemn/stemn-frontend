const initialState = {
  timeline: [
    {
      _id: '1',
      actor: {
        name: 'John Blover',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      timestamp: '2016-06-23T09:26:54Z',
      data: {
        message: 'Updated the code and model for the thingo',
        files:[
          {
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },{
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },
         ]
      }
    }, {
      _id: '2',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      timestamp: '2016-06-23T09:26:54Z',
      data: {
        message: 'Updated the code and model for the thingo',
        files:[
          {
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },{
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },
         ]
      }
    }, {
      _id: '3',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      timestamp: '2016-06-23T09:26:54Z',
      data: {
        message: 'Updated the code and model for the thingo',
        files:[
          {
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },{
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },
         ]
      }
    }, {
      _id: '4',
      actor: {
        name: 'David Revay',
        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
      },
      event: 'update',
      timestamp: '2016-06-23T09:26:54Z',
      data: {
        message: 'Updated the code and model for the thingo',
        files:[
          {
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },{
            path: 'README.md',
            parentProject : 'stemn',
            rev: '5b5e602372e6e',
            fileType: 'md',
            size: 2823
          },
         ]
      }
    }
  ],
  selected: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SELECT_TIMELINE_ITEM':
          console.log(action.payload);
          return {...state,
            selected: action.payload
          }
        default:
            return state;
    }
}
