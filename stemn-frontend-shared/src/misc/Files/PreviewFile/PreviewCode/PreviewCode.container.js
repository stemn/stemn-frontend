import { connect } from 'react-redux'
import PreviewCode from './PreviewCode'

const stateToProps = ({ files: { previewMarkdown } }) => ({
  previewMarkdown,
})

const dispatchToProps = {
}

export default connect(stateToProps, dispatchToProps)(PreviewCode)

