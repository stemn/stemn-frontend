import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { search } from 'stemn-shared/misc/Search/Search.actions'

import SiteSearchResults from './SiteSearchResults'

const stateToProps = ({ search, routing }, { page, query, type, size, parentType, parentId }) => {
  // Add some defaults
  const _type = type || 'project'
  const _page = page || 1
  const _query = query
  const _size = size || 30

  const cacheKey = `${_type}-${query}-${_page}-${parentType}-${parentId}`
  return {
    query: _query,
    type: _type,
    page: _page,
    cacheKey,
    results: search.data[cacheKey],
    searchQuery: search.query,
    size: _size,
    location: routing.locationBeforeTransitions,
  }
}

const dispatchToProps = {
  search
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.search({
      entityType: props.type,
      parentType: props.parentType,
      parentId: props.parentId,
      value: props.query,
      page: props.page,
      size: props.size,
    })
  }
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
