import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { search } from 'stemn-shared/misc/Search/Search.actions'

import SiteSearchResults from './SiteSearchResults'

const stateToProps = ({ search, routing }, { page, query, type, size, parentType, parentId, sort, criteria }) => {
  // Add some defaults
  const _type = type || 'project'
  const _page = page || 1
  const _size = size || 30

  const criteriaWithQuery = Object.assign({}, criteria, {
    name: query && `/${query}/i`,
  })

  const cacheKey = `${_type}-${_page}-${parentType}-${parentId}-${sort}-${JSON.stringify(criteriaWithQuery)}`
  return {
    cacheKey,
    criteria: criteriaWithQuery,
    location: routing.locationBeforeTransitions,
    page: _page,
    query,
    results: search.data[cacheKey],
    size: _size,
    sort,
    type: _type,
  }
}

const dispatchToProps = {
  search,
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.search({
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

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class SiteSearchResultsContainer extends Component {
  render() {
    return (
      <SiteSearchResults { ...this.props } />
    )
  }
}
