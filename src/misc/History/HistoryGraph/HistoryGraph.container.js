import { connect } from 'react-redux'
import HistoryGraph from './HistoryGraph'
import { getHistory } from '../History.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fillRange } from '../History.utils.js'
import moment from 'moment'
import { get } from 'lodash'

const stateToProps = ({ history }, { entityType, entityId, parentType, parentId, type }) => {
  const historyCacheKey = `${entityType}-${entityId}-${parentType}-${parentId}-${type}`
  const to = moment()
  const from = to.clone().subtract(20, 'days')
  const data = get(history, [historyCacheKey, 'data'], [])

  return {
    data: fillRange(from, to, 'date')(data),
    loading: get(history, [historyCacheKey, 'loading'], true),
    hasLoaded: data.length > 0,
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
      from: props.from.format(),
      to: props.to.format(),
      types: props.type ? [props.type] : undefined,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(HistoryGraph)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
