import { connect } from 'react-redux'
import { compose } from 'redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { search as searchAction } from 'stemn-shared/misc/Search/Search.actions'
import { SiteSearchResults } from './SiteSearchResults'

export interface ISiteSearchResultsContainerProps {
  page: number,
  size: number,
  sort: string,
  type: 'project' | 'user' | 'field',
  criteria?: object,
  parentType?: string,
  parentId?: string,
  query?: string,
  display?: 'tag' | 'projectRow',
}

const stateToProps = ({ search, routing }, { page = 1, query, type= 'project', size = 30, parentType, parentId, sort, criteria }: ISiteSearchResultsContainerProps) => {
  const criteriaWithQuery = { ...criteria, name: query && `/${query}/i` }
  const cacheKey = `${type}-${page}-${parentType}-${parentId}-${sort}-${JSON.stringify(criteriaWithQuery)}`
  return {
    cacheKey,
    criteria: criteriaWithQuery,
    location: routing.locationBeforeTransitions || {},
    page,
    query,
    results: search.data[cacheKey],
    size,
    sort,
    type,
  }
}

const dispatchToProps = {
  searchAction,
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.searchAction({
      cacheKey: props.cacheKey,
      entityType: props.type,
      page: props.page,
      parentId: props.parentId,
      parentType: props.parentType,
      criteria: props.criteria,
      size: props.size,
      sort: props.sort,
      value: props.query,
    })
  },
}]

export const SiteSearchResultsContainer = compose(
  connect(stateToProps, dispatchToProps),
  fetchDataHoc(fetchConfigs),
)(SiteSearchResults) as React.SFC<ISiteSearchResultsContainerProps>
