import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { search } from 'stemn-shared/misc/Search/Search.actions'

import SiteSearchResults from './SiteSearchResults'

const stateToProps = ({ search: results, routing }, { page, query, type, size, parentType, parentId }) => {
  // Add some defaults
  const _type = type || 'project'
  const _page = page || 1
  const _query = query || ''
  const _size = size || 30

  return {
    query: _query,
    type: _type,
    page: _page,
    pageId: `${_type}-${_query}-${_page}-${parentType}-${parentId}`,
    results,
    size: _size,
    location: routing.locationBeforeTransitions,
  }
}

const dispatchToProps = {
  search
}

const fetchConfigs = [{
  hasChanged: 'pageId',
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
