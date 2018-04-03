import { connect } from 'react-redux'
import Terminal from './Terminal'
import { getLines } from '../Terminal.actions'

const stateToProps = ({ terminal: { lines } }, { stepId, pipelineId }) => ({
  lines: lines[stepId],
  rawPath: `${GLOBAL_ENV.API_SERVER}/api/v1/pipelines/${pipelineId}/steps/${stepId}/logs`,
})

const dispatchToProps = {
  getLines,
}

export default connect(stateToProps, dispatchToProps)(Terminal)
