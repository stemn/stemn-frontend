import { connect } from 'react-redux'
import HistoryGraph from './HistoryGraph'
import { getHistory } from '../History.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fillRange } from '../History.utils.js'
import moment from 'moment'
import { get } from 'lodash'

//console.log(fillRange());


const stateToProps = ({ history }, { entityType, entityId, parentType, parentId }) => {
  const historyCacheKey = `${entityType}-${entityId}-${parentType}-${parentId}`
  const to = moment()
  const from = to.clone().subtract(30, 'days')

  return {
    data: fillRange(from, to, 'date')(get(history, [historyCacheKey, 'data'], [])),
    loading: get(history, [historyCacheKey, 'loading'], true),
    historyCacheKey,
    from,
    to,
  }
}

const dispatchToProps = {
  getHistory,
}

const fetchConfigs = [{
  hasChanged: 'historyCacheKey',
  onChange: (props) => {
    props.getHistory({
      entityType: props.entityType,
      entityId: props.entityId,
      parentType: props.parentType,
      parentId: props.parentId,
      cacheKey: props.historyCacheKey,
      from: props.from,
      to: props.to
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(HistoryGraph)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
