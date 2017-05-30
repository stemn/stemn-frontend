import { connect } from 'react-redux'
import ThreadRow from './ThreadRow'
import { getThread } from '../Threads.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'


const stateToProps = ({ threads }, { threadId }) => ({
  thread: threads.data[threadId],
})

const dispatchToProps = {
  getThread,
}

const fetchConfigs = [{
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getThread({
      threadId: props.threadId,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(ThreadRow)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)

export default withRedux
