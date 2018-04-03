import { connect } from 'react-redux'
import PipelineMap from './PipelineMap'

const stateToProps = ({ pipelines: { stepData } }) => ({
  stepData,
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(PipelineMap)
