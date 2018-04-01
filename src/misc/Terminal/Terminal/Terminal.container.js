import { connect } from 'react-redux'
import Terminal from './Terminal'
import { getLines } from '../Terminal.actions'

const stateToProps = ({ terminal: { lines } }, { stepId }) => ({
  lines: lines[stepId],
})

const dispatchToProps = {
  getLines,
}

export default connect(stateToProps, dispatchToProps)(Terminal)
