import { connect } from 'react-redux'
import TaskRow from './TaskRow'
import { getTask } from '../Tasks.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'


const stateToProps = ({ tasks }, { taskId }) => ({
  task: tasks.data[taskId],
})

const dispatchToProps = {
  getTask,
}

const fetchConfigs = [{
  hasChanged: 'taskId',
  onChange: (props) => {
    props.getTask({
      taskId: props.taskId,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(TaskRow)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)

export default withRedux
