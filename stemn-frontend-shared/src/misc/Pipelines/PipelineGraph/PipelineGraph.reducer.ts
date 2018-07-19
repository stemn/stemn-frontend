import * as i from 'icepick'
import { IPipelineConfig, IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'

import IconUpload from 'react-icons/go/cloud-upload'
import MdCommit from 'react-icons/go/git-commit'
import MdTime from 'react-icons/md/access-time'
import MdMenu from 'react-icons/md/menu'

const schema = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  title: 'Hmm',
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
  },
}

export interface IPipelineGraphStoreState {
  diagrams: {
    [diagramId: string]: {
      selectedStep: string,
      model: IPipelineConfig,
    },
  },
  steps: IStep[],
}

const initialState: IPipelineGraphStoreState = {
  diagrams: {},
  steps: [{
    type: 'stemn/upload',
    name: 'Upload files',
    category: 'action',
    icon: IconUpload,
    schema,
  }, {
    type: 'stemn/file-revision',
    name: 'File Revision',
    category: 'trigger',
    icon: IconUpload,
  }, {
    type: 'stemn/file-commit',
    name: 'File Commit',
    category: 'trigger',
    icon: MdCommit,
  },  {
    type: 'stemn/webhook-trigger',
    name: 'Webhook Trigger',
    category: 'trigger',
    icon: MdMenu,
  }, {
    type: 'stemn/chron',
    name: 'Time of day',
    category: 'trigger',
    icon: MdTime,
  }, {
    type: 'stemn/and-condition',
    name: 'And',
    category: 'condition',
    icon: MdMenu,
  }, {
    type: 'stemn/throttle-condition',
    name: 'Throttle',
    category: 'condition',
    icon: MdMenu,
  }, {
    type: 'stemn/file-is-condition',
    name: 'File is',
    category: 'condition',
    icon: MdMenu,
  }, {
    type: 'stemn/email-confirm',
    name: 'Email Confirm',
    category: 'condition',
    icon: MdMenu,
  }, {
    type: 'stemn/file-changed',
    name: 'File changed',
    category: 'condition',
    icon: MdMenu,
  }, {
    type: 'stemn/send-email',
    name: 'Send email',
    category: 'action',
    icon: MdMenu,
  }, {
    type: 'stemn/send-slack',
    name: 'Send slack',
    category: 'action',
    icon: MdMenu,
  }, {
    type: 'stemn/convert-file',
    name: 'Convert file',
    category: 'action',
    icon: MdMenu,
  }, {
    type: 'stemn/render',
    name: 'Render CAD model',
    category: 'action',
    icon: MdMenu,
  }, {
    type: 'stemn/3d-print',
    name: '3D print',
    category: 'action',
    icon: MdMenu,
  }, {
    type: 'stemn/convert-cad-query',
    name: 'Convert CAD query',
    category: 'action',
    icon: MdMenu,
  }],
}

export default (state: IPipelineGraphStoreState = initialState, action) => {
  switch (action.type) {
    case 'PIPELINE_DIAGRAM/INITIALISE_MODEL':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'model'], action.payload.model)

    case 'PIPELINE_DIAGRAM/SELECT_STEP':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'selectedStep'], action.payload.stepId)

    case 'PIPELINE_DIAGRAM/ADD_STEP':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'model', 'steps', action.payload.stepId], action.payload.step)

    default:
      return state
  }
}
