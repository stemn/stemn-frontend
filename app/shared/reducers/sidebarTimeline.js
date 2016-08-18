var u = require('updeep');

const initialState = {
//  timeline: [
//    {
//      _id: '1',
//      actor: {
//        name: 'John Blover',
//        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
//      },
//      event: 'update',
//      timestamp: '2016-08-23T09:26:54Z',
//      data: {
//        summary: 'Updated the code and model for the thingo',
//        description: 'Added a number of different files and fiddles with some shit. Closed task 10, 11 12 and more. That is nice!',
//        files:[
//          {
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },{
//            path: 'Demo%20Files/README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 12599
//          },{
//            path: 'demo files/pcb models/Demo 4/hexapod.brd',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'brd',
//            size: 12599
//          },{
//            path: 'demo files/Documents/Demo.pdf',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'pdf',
//            size: 123
//          },{
//            path: 'demo files/Images/Demo.bmp',
//            parentProject : 'stemn',
//            rev: '5b40602372e6e',
//            fileType: 'bmp',
//            size: 123
//          },{
//            path: 'demo files/CAD Models/Demo.dwf',
//            parentProject : 'stemn',
//            rev: '5b40602372e6e',
//            fileType: 'dwf',
//            size: 123
//          },
//         ]
//      }
//    }, {
//      _id: '2',
//      actor: {
//        name: 'David Revay',
//        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
//      },
//      event: 'update',
//      timestamp: '2016-07-23T09:26:54Z',
//      data: {
//        summary: 'When I made it real good and shit.',
//        description: 'Added a number of different files and fiddles with some shit. Closed task 10, 11 12 and more. That is nice!',
//        files:[
//          {
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },{
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },
//         ]
//      }
//    }, {
//      _id: '3',
//      actor: {
//        name: 'David Revay',
//        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
//      },
//      event: 'update',
//      timestamp: '2016-07-22T09:26:54Z',
//      data: {
//        summary: 'Some changes',
//        description: 'Added a number of different files and fiddles with some shit. Closed task 10, 11 12 and more. That is nice!',
//        files:[
//          {
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },{
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },
//         ]
//      }
//    }, {
//      _id: '4',
//      actor: {
//        name: 'David Revay',
//        picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
//      },
//      event: 'update',
//      timestamp: '2016-06-23T09:26:54Z',
//      data: {
//        summary: 'Initial Commit',
//        description: 'Added a number of different files and fiddles with some shit. Closed task 10, 11 12 and more. That is nice!',
//        files:[
//          {
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },{
//            path: 'README.md',
//            parentProject : 'stemn',
//            rev: '5b5e602372e6e',
//            fileType: 'md',
//            size: 2823
//          },
//         ]
//      }
//    }
//  ],
//  selected: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SELECT_TIMELINE_ITEM':
          return u({
            [action.payload.config.meta.stub] : { selected : action.payload}
          }, state)
        case 'TIMELINE/FETCH_TIMELINE_FULFILLED':
          return u({
            [action.payload.config.meta.stub] : {
              data : action.payload.data,
              selected: {},
            }
          }, state)
        default:
            return state;
    }
}
