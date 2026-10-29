import { connect } from 'react-redux'
import { show } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { closeAll } from 'stemn-shared/misc/Modal/Modal.actions.js'
import Link from './Link'

const stateToProps = () => ({})

const dispatchToProps = (dispatch) => ({
  showWindow: (window) => dispatch(show(window)),
  closeAll: () => dispatch(closeAll()),
  dispatch,
})

export default connect(stateToProps, dispatchToProps)(Link)
