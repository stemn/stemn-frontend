import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { search } from 'stemn-shared/misc/Search/Search.actions'

import Search from './Search'

const stateToProps = ({ search: results }, { location }) => {
  const size = 18
  const page = parseInt(location.query.page || 1)
  const query = location.query.q || ''
  const type = location.query.type || 'project'

  return {
    query,
    type,
    pageId: `${type}-${query}-${page}`,
    results,
    size,
    page,
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
      value: props.query,
      page: props.page,
      size: props.size,
    })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class SearchContainer extends Component {
  render() {
    return (
      <Search {...this.props} />
    )
  }
}
