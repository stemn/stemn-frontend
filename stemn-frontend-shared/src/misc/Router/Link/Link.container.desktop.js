import { connect } from 'react-redux'
import { show as showWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { closeAll } from 'stemn-shared/misc/Modal/Modal.actions.js'
import Link from './Link'

const stateToProps = () => ({})

const dispatchToProps = dispatch => ({
  showWindow: () => dispatch(showWindow),
  closeAll: () => dispatch(closeAll),
  dispatch,
})

export default connect(stateToProps, dispatchToProps)(Link)

