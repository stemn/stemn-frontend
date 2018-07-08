import { connect } from 'react-redux'
import PipelineMiniMap from './PipelineMiniMap'

const stateToProps = ({ pipelines: { stepData } }) => ({
  stepData,
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(PipelineMiniMap)
