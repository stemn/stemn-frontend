import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { search } from 'stemn-shared/misc/Search/Search.actions'
import MentionPopover from './MentionPopover'

const stateToProps = ({ search }, { entityType, query, page, parentType, parentId, cacheKey }) => {
  const _cacheKey = cacheKey || `${entityType}-${query}-${page}-${parentType}-${parentId}`
  return {
    results: search.data[cacheKey],
    cacheKey: _cacheKey,
  }
}

const dispatchToProps = {
  search,
}

const fetchConfigs = [{
  hasChanged: (nextProps, prevProps) => nextProps.cacheKey !== prevProps.cacheKey || nextProps.query !== prevProps.query,
  onChange: (props) => {
    if (props.query && props.query.length > 0) {
      props.search({
        entityType: props.entityType,
        criteria: {
          name: props.query && `/${props.query}/i`,
        },
        cacheKey: props.cacheKey,
      })
    }
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class MentionPopoverContainer extends Component {
  render() {
    return (
      <MentionPopover { ...this.props } />
    )
  }
}
