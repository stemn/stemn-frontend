import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import EmailAndNotificationToggles from './EmailAndNotificationToggles'

const stateToProps = () => ({})

const dispatchToProps = {
  change: storeChange,
}

export default connect(stateToProps, dispatchToProps)(EmailAndNotificationToggles)
