import { connect } from 'react-redux'
import { upload } from '../Upload.actions.js'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import Upload from './Upload'

const mapStateToProps = ({ upload }, { uploadId }) => ({
  uploadData: upload[uploadId],
})

const mapDispatchToProps = {
  upload,
  change: storeChange,
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload)
