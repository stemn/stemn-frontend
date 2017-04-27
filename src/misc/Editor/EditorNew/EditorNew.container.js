import { connect } from 'react-redux'
import EditorNew from './EditorNew'
import { actions } from 'react-redux-form'

const stateToProps = () => ({})

const dispatchToProps = {
  change: actions.change,
}

export default connect(stateToProps, dispatchToProps)(EditorNew)
