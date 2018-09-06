import { connect } from 'react-redux'
import DownloadButton from './DownloadButton'

const stateToProps = ({ desktopReleases }) => ({
  latest: desktopReleases.latest,
})

const dispatchToProps = {
}

export default connect(stateToProps, dispatchToProps)(DownloadButton)
