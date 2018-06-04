import { connect } from 'react-redux'
import SearchInput from './SearchInputAlt'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

const stateToProps = () => ({})

const dispatchToProps = {
  change: storeChange,
}

export default connect(stateToProps, dispatchToProps)(SearchInput)
