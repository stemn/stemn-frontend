export const pipeline = {
  _id: '5abf148fe1a7a2001970dab4',
  project: {
    _id: '5a88ff3f236712000f83bbd8',
  },
  fileId: '5ab30cf235c1cd0042ea6677',
  revisionId: '5ab30cf235c1cd0042ea6676',
  root: '30f8f192-c1a7-4223-b881-446e97fd9fbe',
  event: 'revision',
  name: 'Generate parametric resin mould',
  status: 'pending',
  pipelineNumber: '43',
  user: {
    _id: '547db55af7f342380174e228',
    name: 'David Revay',
    picture: '/uploads/2b4ae5ac-e869-4a7d-8b99-4de21d852a8a.jpg',
  },
  config: {
    triggers: [
      {
        type: 'revision',
        files: 'resin-mould.py',
      },
    ],
    stages: [
      {
        steps: [
          {
            command: [
              'build',
              '--in_spec',
              '/pipeline/resin-mould.py',
              '--format',
              'STEP',
            ],
            outputFiles: [
              'cqobject*',
            ],
            inputFiles: [
              'resin-mould.py',
            ],
            image: 'dcowden/cadquery:latest',
            label: 'STEP',
          },
        ],
        label: 'convert',
      },
      {
        steps: [
          {
            inputFiles: [
              'cqobject*',
            ],
            image: 'stemn/upload:latest',
            label: 'stemn',
          },
        ],
        label: 'upload',
      },
    ],
  },
  stages: [
    {
      _id: '5ab30cf335c1cd0042ea6679',
      name: 'convert',
      status: 'running',
      steps: [{
        _id: '5ab450710741c3005e4cda54',
        stage: '5ab30cf335c1cd0042ea6679',
        name: 'to STEP',
        status: 'running',
      }, {
        _id: '5ab450710741c3005e4cea22',
        stage: '5ab30cf335c1cd0042ea6679',
        name: 'to STL',
        status: 'pending',
      }],
    },
    {
      _id: '5ab30cf335c1cd0042ea667a',
      name: 'upload',
      status: 'pending',
      steps: [{
        _id: '5ab450710741c3005e4cda0f',
        stage: '5ab30cf335c1cd0042ea667a',
        name: 'to Stemn',
        status: 'pending',
      }],
    },
  ],
  outputFiles: [],
  inputRevisions: [
    '5ab30cf235c1cd0042ea6676',
  ],
}