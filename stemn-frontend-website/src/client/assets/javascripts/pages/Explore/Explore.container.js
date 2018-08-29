import { connect } from 'react-redux'
import Explore from './Explore'
import { replace } from 'react-router-redux'

const stateToProps = () => ({})

const dispatchToProps = {
  replace,
}

export default connect(stateToProps, dispatchToProps)(Explore)