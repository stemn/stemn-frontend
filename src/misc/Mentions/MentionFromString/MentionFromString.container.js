import { connect } from 'react-redux'
import MentionFromString from './MentionFromString'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import taskDisplayModalName from 'stemn-shared/misc/Tasks/TaskDisplayModal'

const stateToProps = () => ({})

const dispatchToProps = {
  showTaskModal: (modalProps) => showModal({
    modalType: taskDisplayModalName,
    limit: 1,
    modalProps,
  }),
}

export default connect(stateToProps, dispatchToProps)(MentionFromString)
