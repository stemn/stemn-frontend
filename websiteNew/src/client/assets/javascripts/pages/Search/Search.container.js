import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { search } from 'stemn-shared/misc/Search/Search.actions'

import Search from './Search'

const stateToProps = ({ search }, { location }) => ({
  query: location.query.q || '',
  type: location.query.type || 'project',
  queryString: `${location.query.type}-${location.query.q}`,
  results: search,
})

const dispatchToProps = {
  search
}

const fetchConfigs = [{
  hasChanged: 'queryString',
  onChange: (props) => {
    props.search({
      entityType: props.type,
      value: props.query
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
