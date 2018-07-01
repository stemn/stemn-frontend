import { connect } from 'react-redux'
import { rerunPipeline, cancelPipeline } from 'stemn-shared/misc/Pipelines/Pipelines.actions.js'
import ProjectPipelineMeta from './ProjectPipelineMeta'

const stateToProps = () => ({})

const dispatchToProps = {
  rerunPipeline,
  cancelPipeline,
}

export default connect(stateToProps, dispatchToProps)(ProjectPipelineMeta)
