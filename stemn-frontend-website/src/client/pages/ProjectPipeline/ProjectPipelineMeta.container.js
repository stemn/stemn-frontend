import { connect } from 'react-redux'
import { rerunPipeline } from 'stemn-shared/misc/Pipelines/Pipelines.actions.js'
import ProjectPipelineMeta from './ProjectPipelineMeta'

const stateToProps = () => ({})

const dispatchToProps = {
  rerunPipeline,
}

export default connect(stateToProps, dispatchToProps)(ProjectPipelineMeta)
