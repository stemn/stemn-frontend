import { connect } from 'react-redux'
import PipelineRow from './PipelineRow'

const stateToProps = ({ pipelines: { pipelineData } }, { pipelineId }) => ({
  pipeline: pipelineData[pipelineId],
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(PipelineRow)
