import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import classes from './SiteSearchResults.css'
import EntityRow from 'stemn-shared/misc/EntityRow'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import Pagination from 'stemn-shared/misc/Pagination'

export default class SiteSearchResults extends Component {
  render() {
    const { results, size, page, location, query } = this.props
    const noResults = results && !results.loading && !get(results, ['data', 'length']) > 0
    const noMoreResults = results && results.data && results.data.length < size

    return (
      <div>
        <div className={ classes.results + ' layout-column'}>
          <LoadingOverlay
            show={ !results || results.loading }
            linear
            noOverlay
          />
          { results && results.data && results.data.map((result) => (
            <EntityRow
              key={ result._id }
              data={ result }
              query={ query }
              className={ classes.result }
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
