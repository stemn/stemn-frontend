import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import DownloadModal from './DownloadModal'

import { get } from 'lodash'

const stateToProps = ({ syncTimeline }, { file }) => ({
  syncTimeline: get(syncTimeline, [file.fileId], {}),
})

const dispatchToProps = {
  fetchTimeline,
}

const modalName = 'FILE_DOWNLOAD'
const ModalComponent = connect(stateToProps, dispatchToProps)(DownloadModal)
registerModal(modalName, ModalComponent)
export default modalName
