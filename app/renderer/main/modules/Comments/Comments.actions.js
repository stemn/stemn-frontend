
export function getComments({taskId}) {
  return {
    type: 'COMMENTS/GET_COMMENTS',
    meta: {
      taskId
    },
    payload: {
      response: {
        data: [{
          "_id": "563ace2d5a5fa4ae06de50dd",
          "parent": "563aaea6142ffe154a28affe",
          "owner": {
              "_id": "5498e258a7fbbfcc12c3fa15",
              "name": "Jackson Delahunt",
              "stub": "jackson",
              "numProjects": 2,
              "followers": 85,
              "profile": {
                  "banner": {
                      "gradient": null,
                      "url": "/uploads/341024ff-b200-4f3a-9aba-c3049d7bc92e.jpeg"
                  },
                  "lastname": "Delahunt",
                  "firstname": "Jackson"
              },
              "blurb": "Co-Founder and CEO at STEMN",
              "picture": "/uploads/8565e053-d1ef-40a4-97ca-5841b79a3d17.jpg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "votes": 0,
          "__v": 0,
          "likes": 1,
          "edited": "2015-11-05T03:34:05.950Z",
          "timestamp": "2015-11-05T03:34:05.950Z",
          "sectionData": {
              "sections": {
                  "e7f200e1b96d45c3349167b5": {
                      "id": "e7f200e1b96d45c3349167b5",
                      "content": "<p>JSON has become the de facto data representation format on the web, and our web app is written entirely in Javascript, so this is the main format we will be using. However, we realise CSV is a very common format used by people, so we will offer support for both formats.</p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["e7f200e1b96d45c3349167b5"]
          },
          "blurb": "JSON has become the de facto data representation format on the web, and our web app is written entirely in Javascript, so this is the main format we will be...",
          "parentType": "thread"
      }, {
          "_id": "563aaea6142ffe154a28affe",
          "owner": {
              "_id": "55963596423fe3ab0f034ded",
              "stub": "brandenshort52",
              "name": "Branden Short",
              "numProjects": 0,
              "followers": 20,
              "profile": {
                  "banner": {
                      "gradient": 5,
                      "url": ""
                  },
                  "lastname": "Short",
                  "firstname": "Branden"
              },
              "blurb": "Full time engineer | Part time space lover",
              "picture": "/uploads/0e94a25f-b10f-4e64-9e53-13f12800dce3.jpeg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "votes": 0,
          "__v": 0,
          "likes": 0,
          "edited": "2015-11-05T01:19:34.081Z",
          "timestamp": "2015-11-05T01:19:34.081Z",
          "sectionData": {
              "sections": {
                  "a8dbf76a0e5c4e8f13719c23": {
                      "id": "a8dbf76a0e5c4e8f13719c23",
                      "content": "<p>I think for me the most valuable feature there is the graphs. What format would you expect the graph data to be in?</p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["a8dbf76a0e5c4e8f13719c23"]
          },
          "blurb": "I think for me the most valuable feature there is the graphs. What format would you expect the graph data to be in? ",
          "parentType": "thread"
      }, {
          "_id": "55ed0f2c9adb9dfe12d1b7b9",
          "owner": {
              "_id": "55a8c380d3c18bd35fdb0ff0",
              "stub": "roderickbrouwera6",
              "name": "Roderick Brouwer",
              "numProjects": 0,
              "followers": 13,
              "profile": {
                  "banner": {
                      "gradient": 5,
                      "url": ""
                  },
                  "lastname": "Brouwer",
                  "firstname": "Roderick"
              },
              "blurb": "Satellite Guy",
              "picture": "/uploads/98e3d594-c6ef-4965-9838-50db9a3d6038.png",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "votes": 0,
          "body": "<p>It's looking really good! I think all the features you mentioned would be great. The graphs especially. My votes:</p><p>1. Graphs</p><p>2. Tables<br/></p><p>3. File Upload<br/></p><p><br/></p><p></p>",
          "__v": 0,
          "likes": 0,
          "edited": "2015-09-08T07:29:56.411Z",
          "timestamp": "2015-09-07T04:14:36.554Z",
          "sectionData": {
              "sections": {
                  "0dd2cd67-190f-4c03-bdd4-5e8f4471e84b": {
                      "type": "text",
                      "content": "<p>It's looking really good! I think all the features you mentioned would be useful. The graphs especially, I don't know of any other web text editor that has this capability. My votes:</p><p>1. Graphs, 2. Tables, 3. File Upload<br></p>",
                      "id": "0dd2cd67-190f-4c03-bdd4-5e8f4471e84b"
                  }
              },
              "sectionOrder": ["0dd2cd67-190f-4c03-bdd4-5e8f4471e84b"]
          },
          "blurb": "It's looking really good! I think all the features you mentioned would be useful. The graphs especially, I don't know of any other web text editor that has this...",
          "parentType": "thread"
      }, {
          "_id": "5744cef1018557c35098967b",
          "owner": {
              "_id": "5737981fd7e326bcb5aa0256",
              "name": "Tom Riecken",
              "stub": "tomrieckenf0",
              "numProjects": 0,
              "followers": 0,
              "profile": {
                  "banner": {
                      "gradient": 4,
                      "url": ""
                  },
                  "lastname": "Riecken",
                  "firstname": "Tom"
              },
              "blurb": "",
              "picture": "/uploads/a67021c3-f2a1-4ce9-a310-fdc6cd97c22b.jpg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "__v": 0,
          "likes": 0,
          "edited": "2016-05-24T22:15:32.638Z",
          "timestamp": "2016-05-24T22:00:17.434Z",
          "sectionData": {
              "sections": {
                  "0d42be1b2c3f84685ecaf310": {
                      "id": "0d42be1b2c3f84685ecaf310",
                      "content": "That sounds really cool? Is this editor available? Does it extend an existing editor like Sublime? -- NVM, you meant your site's WSYWIG<br><p><br></p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["0d42be1b2c3f84685ecaf310"]
          },
          "blurb": "That sounds really cool? Is this editor available? Does it extend an existing editor like Sublime? -- NVM, you meant your site's WSYWIG",
          "parentType": "thread"
      }, {
          "_id": "57486b3706ef7c0c37d0a706",
          "owner": {
              "_id": "56df872976a0781e35a62731",
              "name": "Alexander Halaszyn",
              "stub": "alexanderhalaszyn",
              "numProjects": 6,
              "followers": 11,
              "profile": {
                  "banner": {
                      "gradient": 2,
                      "url": "/uploads/4c2e80bf-9199-4111-9511-6da1abb172ca.jpeg"
                  },
                  "lastname": "Halaszyn",
                  "firstname": "Alexander"
              },
              "blurb": "Pursuing World-Class Experience in Systems Engineering, Test Design, and Commercial Space",
              "picture": "/uploads/0734f8f5-b2a5-4f62-a4ec-4459d7abb049.jpeg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "__v": 0,
          "likes": 0,
          "edited": "2016-05-27T15:43:51.013Z",
          "timestamp": "2016-05-27T15:43:51.012Z",
          "sectionData": {
              "sections": {
                  "76b10c8fea9b253aec743820": {
                      "id": "76b10c8fea9b253aec743820",
                      "content": "<p>This is excellent news! Great to hear a bit of a progress update.</p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["76b10c8fea9b253aec743820"]
          },
          "blurb": "This is excellent news! Great to hear a bit of a progress update.",
          "parentType": "thread"
      }, {
          "_id": "57486b7ce6d3bc2c0519d4ec",
          "parent": "57486b3706ef7c0c37d0a706",
          "owner": {
              "_id": "5498e258a7fbbfcc12c3fa15",
              "name": "Jackson Delahunt",
              "stub": "jackson",
              "numProjects": 2,
              "followers": 85,
              "profile": {
                  "banner": {
                      "gradient": null,
                      "url": "/uploads/341024ff-b200-4f3a-9aba-c3049d7bc92e.jpeg"
                  },
                  "lastname": "Delahunt",
                  "firstname": "Jackson"
              },
              "blurb": "Co-Founder and CEO at STEMN",
              "picture": "/uploads/8565e053-d1ef-40a4-97ca-5841b79a3d17.jpg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "__v": 0,
          "likes": 1,
          "edited": "2016-05-27T15:45:00.091Z",
          "timestamp": "2016-05-27T15:45:00.091Z",
          "sectionData": {
              "sections": {
                  "95107d2363cc8eb4ffa91d0b": {
                      "id": "95107d2363cc8eb4ffa91d0b",
                      "content": "<p>Thanks Alexander! We have a big change in the works that we're looking forward to releasing in a couple of weeks. Anybody who would like early access should email beta@stemn.com :)</p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["95107d2363cc8eb4ffa91d0b"]
          },
          "blurb": "Thanks Alexander! We have a big change in the works that we're looking forward to releasing in a couple of weeks. Anybody who would like early access should...",
          "parentType": "thread"
      }, {
          "_id": "57486bc724018af278bfa903",
          "parent": "57486b7ce6d3bc2c0519d4ec",
          "owner": {
              "_id": "56df872976a0781e35a62731",
              "name": "Alexander Halaszyn",
              "stub": "alexanderhalaszyn",
              "numProjects": 6,
              "followers": 11,
              "profile": {
                  "banner": {
                      "gradient": 2,
                      "url": "/uploads/4c2e80bf-9199-4111-9511-6da1abb172ca.jpeg"
                  },
                  "lastname": "Halaszyn",
                  "firstname": "Alexander"
              },
              "blurb": "Pursuing World-Class Experience in Systems Engineering, Test Design, and Commercial Space",
              "picture": "/uploads/0734f8f5-b2a5-4f62-a4ec-4459d7abb049.jpeg",
              "type": "user",
              "entityType": "user"
          },
          "thread": {
              "_id": "55e8fd01d4e3a01754489910",
              "owner": "547db55af7f342380174e228",
              "stub": "stemn-has-a-new-text-editor",
              "name": "STEMN has a new text editor!",
              "numPosts": 7,
              "wordCount": 457,
              "likes": 10,
              "submitted": "2015-09-04T02:08:01.780Z",
              "updated": "2016-05-27T15:46:15.829Z",
              "type": "blog",
              "organisations": ["54fed91a5cb878bf19577a48"],
              "fields": ["5521fbe89fbbb77c26244c28", "5521fbe89fbbb77c26244c2a"],
              "projects": ["54ade32685bb4c5c1064ea29"],
              "banner": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "blurb": "We struggled for a long time with editors on STEMN. You'd think an editor is a simple thing... They aren't.  After faffing around with a myriad of 3rd party...",
              "picture": "/uploads/7d4a354f-a50e-4098-b2fb-ca9c4464c0c4.png",
              "entityType": "thread"
          },
          "__v": 0,
          "likes": 1,
          "edited": "2016-05-27T15:46:15.769Z",
          "timestamp": "2016-05-27T15:46:15.769Z",
          "sectionData": {
              "sections": {
                  "f49b9828d61c70a57afe2413": {
                      "id": "f49b9828d61c70a57afe2413",
                      "content": "<p>Done! :)</p>",
                      "type": "text"
                  }
              },
              "sectionOrder": ["f49b9828d61c70a57afe2413"]
          },
          "blurb": "Done! :)",
          "parentType": "thread"
      }]
      }
    },
  }
}


export function startEdit({commentId}) {
  return {
    type: 'COMMENTS/START_EDIT',
    payload: {
      commentId
    }
  }
}
export function finishEdit({commentId}) {
  return {
    type: 'COMMENTS/FINISH_EDIT',
    payload: {
      commentId
    }
  }
}

export function deleteComment({commentId}) {
  return {
    type: 'COMMENTS/DELETE',
    payload: {
      commentId
    }
  }
}
export function saveComment({commentId}) {
  return {
    type: 'COMMENTS/SAVE',
    payload: {
      commentId
    }
  }
}

