import { get } from 'lodash'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getUser } from 'stemn-shared/misc/Users/Users.actions'
import UserNameFromId from './UserNameFromId'

const stateToProps = ({ users }, { userId }) => ({
  user: get(users, [userId], {}),
})

const dispatchToProps = {
  getUser,
}

const fetchConfigs = [{
  hasChanged: 'userId',
  onChange: (props) => {
    props.getUser({
      userId: props.userId,
      size: 'sm',
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(UserNameFromId)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
