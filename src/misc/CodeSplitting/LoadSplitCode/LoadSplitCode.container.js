import { connect } from 'react-redux'
import { loadCode } from 'stemn-shared/misc/CodeSplitting/CodeSplitting.actions'
import LoadSplitCode from './LoadSplitCode'

const stateToProps = () => ({})

const dispatchToProps = {
  loadCode,
}

export default connect(stateToProps, dispatchToProps)(LoadSplitCode)
