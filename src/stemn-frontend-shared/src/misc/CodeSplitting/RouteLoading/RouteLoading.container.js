import { connect } from 'react-redux'
import RouteLoading from './RouteLoading'
import { get } from 'lodash'

const stateToProps = ({ codeSplitting }) => ({
  loading: get(codeSplitting, ['route', 'loading']),
})

const dispatchToProps = {
}

export default connect(stateToProps, dispatchToProps)(RouteLoading)
