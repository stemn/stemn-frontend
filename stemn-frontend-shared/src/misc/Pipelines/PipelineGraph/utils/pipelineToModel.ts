import { DiagramModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>

// const pipe = {
//   "offsetX": 16.03743511547765,
//   "offsetY": 8.60898278872811,
//   "status": "disabled",
//   "zoom": 90,
//   "userId": "5a72dc9730bd3dfb764f86f4",
//   "name": "forward-to-voicemail",
//   "gridSize": 0,
//   "links": [{
//       "type": "default",
//       "sourcePort": "1910533c-a60d-4905-b996-bd4ba934ef1c",
//       "color": "rgba(255,255,255,0.5)",
//       "targetPort": "0c100e84-5306-4b97-8ed6-b93e75b71524",
//       "points": [{
//           "x": 293.8611560782887,
//           "selected": false,
//           "id": "5d688215-12cf-4f13-a2f1-5a671234e44f",
//           "y": 157.8888838697292
//       }, {
//           "selected": false,
//           "id": "a18612cd-5987-4ab1-80bc-694732fccc69",
//           "y": 192.54166164750697,
//           "x": 386.72919807047623
//       }],
//       "source": "8cd29aa1-65f5-4645-8ca9-dbe2e101a54f",
//       "selected": false,
//       "target": "b3defa50-54a0-4321-8883-e4dd3c148e0c",
//       "curvyness": 50,
//       "id": "7436e3bc-2145-4e5a-b32b-719c021d554b",
//       "extras": {},
//       "width": 3,
//       "labels": []
//   }, {
//       "target": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//       "curvyness": 50,
//       "id": "ab598c6d-2f77-40e6-b190-e703f4cfd20c",
//       "extras": {},
//       "width": 3,
//       "labels": [],
//       "type": "default",
//       "sourcePort": "2be029d3-6705-427e-a12c-1a463ba69375",
//       "color": "rgba(255,255,255,0.5)",
//       "targetPort": "107288b3-e105-4029-a9d8-eb01c8bcb8b6",
//       "points": [{
//           "y": 307.5416955559271,
//           "x": 604.7292116338443,
//           "selected": false,
//           "id": "e87935cd-d561-44e1-bc9c-6106a20a755c"
//       }, {
//           "x": 381.1771011737748,
//           "selected": false,
//           "id": "6763f3eb-1dd2-48a8-9882-569ab79a746d",
//           "y": 362.54166164750694
//       }],
//       "source": "b3defa50-54a0-4321-8883-e4dd3c148e0c",
//       "selected": false
//   }, {
//       "width": 3,
//       "labels": [],
//       "type": "default",
//       "sourcePort": "4174be56-3950-46ec-b68a-1e821ad1765e",
//       "color": "rgba(255,255,255,0.5)",
//       "targetPort": "c47ca05e-8e70-4d54-a0f2-3768dcef9d51",
//       "points": [{
//           "x": 599.1770469203027,
//           "selected": false,
//           "id": "6f35bd82-6f3d-468c-9a0e-4f6f5ea9bbab",
//           "y": 477.54166164750694
//       }, {
//           "y": 550.5382504604411,
//           "x": 377.8472264992957,
//           "selected": false,
//           "id": "f6b364fb-787d-40a5-b500-db1e061748a6"
//       }],
//       "source": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//       "selected": false,
//       "target": "8f080b3e-cb3c-4d88-b623-5ea8eb401cc2",
//       "curvyness": 50,
//       "id": "7b860f30-9294-44c6-905a-f01cb46dc990",
//       "extras": {}
//   }],
//   "lastEdited": "2018-06-26T06:23:16.801Z",
//   "id": "f6eafd79-ffd5-4129-a690-80cbbeeb426c",
//   "nodes": [{
//       "y": 58.888888888888886,
//       "x": 47.861111111111114,
//       "type": "incoming_call",
//       "id": "8cd29aa1-65f5-4645-8ca9-dbe2e101a54f",
//       "extras": {
//           "number": "+611300615693",
//           "numberSid": "PN210c79f4ce32feaab21374d35381258b"
//       },
//       "selected": false,
//       "ports": [{
//           "name": "output-0",
//           "links": ["7436e3bc-2145-4e5a-b32b-719c021d554b"],
//           "type": "output",
//           "id": "1910533c-a60d-4905-b996-bd4ba934ef1c",
//           "parentNode": "8cd29aa1-65f5-4645-8ca9-dbe2e101a54f",
//           "selected": false
//       }]
//   }, {
//       "extras": {
//           "operator": "is",
//           "value": "NSW"
//       },
//       "selected": false,
//       "ports": [{
//           "name": "input-0",
//           "links": ["7436e3bc-2145-4e5a-b32b-719c021d554b"],
//           "type": "input",
//           "id": "0c100e84-5306-4b97-8ed6-b93e75b71524",
//           "parentNode": "b3defa50-54a0-4321-8883-e4dd3c148e0c",
//           "selected": false
//       }, {
//           "parentNode": "b3defa50-54a0-4321-8883-e4dd3c148e0c",
//           "selected": false,
//           "name": "false",
//           "links": ["ab598c6d-2f77-40e6-b190-e703f4cfd20c"],
//           "type": "output",
//           "id": "2be029d3-6705-427e-a12c-1a463ba69375"
//       }, {
//           "parentNode": "b3defa50-54a0-4321-8883-e4dd3c148e0c",
//           "selected": false,
//           "name": "true",
//           "links": [],
//           "type": "output",
//           "id": "5c0cf875-223f-47a0-8586-899bfa7d3ab8"
//       }],
//       "y": 201.545574679191,
//       "x": 377.7361832050249,
//       "type": "caller_state_is",
//       "id": "b3defa50-54a0-4321-8883-e4dd3c148e0c"
//   }, {
//       "extras": {
//           "operator": "is",
//           "value": "VIC"
//       },
//       "selected": true,
//       "ports": [{
//           "links": ["7b860f30-9294-44c6-905a-f01cb46dc990"],
//           "type": "input",
//           "id": "c47ca05e-8e70-4d54-a0f2-3768dcef9d51",
//           "parentNode": "8f080b3e-cb3c-4d88-b623-5ea8eb401cc2",
//           "selected": false,
//           "name": "input-0"
//       }, {
//           "parentNode": "8f080b3e-cb3c-4d88-b623-5ea8eb401cc2",
//           "selected": false,
//           "name": "false",
//           "links": [],
//           "type": "output",
//           "id": "a3ca8373-db72-431c-a332-76e10623d883"
//       }, {
//           "parentNode": "8f080b3e-cb3c-4d88-b623-5ea8eb401cc2",
//           "selected": false,
//           "name": "true",
//           "links": [],
//           "type": "output",
//           "id": "1690d3de-690d-4617-bea7-b17489e9eb82"
//       }],
//       "y": 561.545574679191,
//       "x": 368.847294316136,
//       "type": "caller_state_is",
//       "id": "8f080b3e-cb3c-4d88-b623-5ea8eb401cc2"
//   }, {
//       "x": 372.18062764946933,
//       "type": "caller_state_is",
//       "id": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//       "extras": {
//           "operator": "is",
//           "value": "QLD"
//       },
//       "selected": false,
//       "ports": [{
//           "parentNode": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//           "selected": false,
//           "name": "input-0",
//           "links": ["ab598c6d-2f77-40e6-b190-e703f4cfd20c"],
//           "type": "input",
//           "id": "107288b3-e105-4029-a9d8-eb01c8bcb8b6"
//       }, {
//           "parentNode": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//           "selected": false,
//           "name": "false",
//           "links": ["7b860f30-9294-44c6-905a-f01cb46dc990"],
//           "type": "output",
//           "id": "4174be56-3950-46ec-b68a-1e821ad1765e"
//       }, {
//           "name": "true",
//           "links": [],
//           "type": "output",
//           "id": "67f0aef7-fdbb-48e6-919c-bc52b704e90e",
//           "parentNode": "a6db75cc-a99a-4891-a102-2dfacf32c31c",
//           "selected": false
//       }],
//       "y": 371.545574679191
//   }]
// }

const pipelineToDiagramLinks = (pipeline: IPipelineConfig): ISerializedDiagram['links'] => []




import { mapObjIndexed, values } from 'ramda'
import { get } from 'lodash'


const pipelineToDiagramNodes = (pipeline: IPipelineConfig) => {
  const nodesObject = mapObjIndexed((step, stepId: string) => ({
    id: stepId,
    x: get(step, 'position.x', 50),
    y: get(step, 'position.y', 50),
    type: step.type,
    extras: {},
    selected: false,
    ports: [],
  }), pipeline.steps)

    //     //   {
    //     //     "name": "output-0",
    //     //     "links": ["7436e3bc-2145-4e5a-b32b-719c021d554b"],
    //     //     "type": "output",
    //     //     "id": "1910533c-a60d-4905-b996-bd4ba934ef1c",
    //     //     "parentNode": "8cd29aa1-65f5-4645-8ca9-dbe2e101a54f",
    //     //     "selected": false
    //     // }

  const nodes: ISerializedDiagram['nodes'] = values(nodesObject)
  return nodes
}


export const pipelineToModel = (pipeline: IPipelineConfig, diagramEngine: DiagramEngine) => {
  const model = new DiagramModel()

  // Get the serialised diagram
  const diagramSerialised: ISerializedDiagram = {
    id: 'diagram',
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    gridSize: 0,
    links: pipelineToDiagramLinks(pipeline),
    nodes: pipelineToDiagramNodes(pipeline),
  }

  // Convert it to the model
  model.deSerializeDiagram(diagramSerialised, diagramEngine)

  return model
}
