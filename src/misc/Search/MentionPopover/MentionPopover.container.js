import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { search } from 'stemn-shared/misc/Search/Search.actions'
import MentionPopover from './MentionPopover'

const stateToProps = ({ search }, { entityType, query, page, parentType, parentId }) => {
  const cacheKey = `${entityType}-${query}-${page}-${parentType}-${parentId}`
  return {
    results: search.data[cacheKey],
    cacheKey,
  }
}

const dispatchToProps = {
  search
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    if (props.query && props.query.length > 0) {
      props.search({
        entityType: props.entityType,
        value: props.query,
      })
    }
  }
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
