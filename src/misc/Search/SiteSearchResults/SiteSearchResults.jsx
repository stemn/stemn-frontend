import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import classes from './SiteSearchResults.css'
import SiteSearchResult from 'stemn-shared/misc/Search/SiteSearchResult'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import Pagination from 'stemn-shared/misc/Pagination'

export default class SiteSearchResults extends Component {
  render() {
    const { results, size, page, location } = this.props
    const noResults = !results.loading && !get(results, ['data', 'length']) > 0
    const noMoreResults = results && results.data && results.data.length < size

    return (
      <div>
        <div className={ classes.results + ' layout-column'}>
          <LoadingOverlay
            show={ results.loading }
            linear
            style={ { background: 'rgba(255, 255, 255, 0.8)' } }
          />
          { results.data.map((result) => (
            <SiteSearchResult
              key={ result._id }
              result={ result }
              query={ results.query }
            />
          )) }
          { noResults && <div className="layout-column flex layout-align-center-center text-title-5">No Search Results</div> }
        </div>
        <Pagination
          path={ location.pathname }
          query={ location.query }
          page={ page }
          noMoreResults={ noMoreResults }
        />
      </div>
    )
  }
}
