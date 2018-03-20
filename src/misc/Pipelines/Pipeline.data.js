
const stages = [{
  _id: 'agsp0gasmpsgampo',
  name: 'Build CAD Files',
  status: 'success',
  steps: [{
    _id: 'step-id-agsoinhaosgn',
    name: 'Build CAD files',
    status: 'success',
  }, {
    _id: 'step-id-hipomnjasf0j',
    name: 'Build other CAD files',
    status: 'success',
  }],
}, {
  _id: 'agsp0gasmpsg12125ampo',
  name: 'Build STL Files',
  status: 'running',
  steps: [{
    _id: 'step-id-opganasogin',
    name: 'Build STLs',
    status: 'running',
  }],
}, {
  _id: 'agsp1241250gasmpsg125ampo',
  name: 'Produce Renders',
  status: 'error',
  steps: [{
    _id: 'step-id-asng1q2sg',
    name: 'Render',
    status: 'error',
  }, {
    _id: 'step-id-bagtsgsa',
    name: 'Render',
    status: 'pending',
  }],
}, {
  _id: 'agsp0gasm0fas90j9psgampo',
  name: 'Email renders',
  status: 'pending',
  steps: [{
    _id: 'step-id-avsbsasb',
    name: 'Send email',
    status: 'pending',
  }, {
    _id: 'step-id-gagsgsa',
    name: 'Send slack notification',
    status: 'pending',
  }, {
    _id: 'step-id-afssaffsafsa',
    name: 'Send slack notification',
    status: 'pending',
  }, {
    _id: 'step-id-asfafs',
    name: 'Send slack notification',
    status: 'pending',
  }],
}, {
  _id: 'agsp01gasm0fas90j9psgampo',
  name: 'Complete renders',
  status: 'pending',
  steps: [{
    _id: 'step-id-avs1bsasb',
    name: 'Send email',
    status: 'pending',
  }],
}]

export const pipeline = {
  _id: 'piplineid123',
  name: 'Some pipeline namn',
  project: {
    _id: '5a88ff3f236712000f83bbd8',
  },
  stages,
}