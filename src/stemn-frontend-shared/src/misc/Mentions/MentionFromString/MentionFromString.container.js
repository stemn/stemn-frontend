import { connect } from 'react-redux'
import MentionFromString from './MentionFromString'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import threadDisplayModalName from 'stemn-shared/misc/Threads/ThreadDisplayModal'

const stateToProps = () => ({})

const dispatchToProps = {
  showThreadModal: modalProps => showModal({
    modalType: threadDisplayModalName,
    limit: 1,
    modalProps,
  }),
}

export default connect(stateToProps, dispatchToProps)(MentionFromString)
