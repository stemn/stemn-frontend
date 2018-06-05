import { connect } from 'react-redux'
import EditorNew from './EditorNew'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  change: storeChange,
}

export default connect(stateToProps, dispatchToProps)(EditorNew)
