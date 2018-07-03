import React, { Component } from 'react'
import { get } from 'lodash'
import classes from './SiteSearchResults.css'
import EntityRow from 'stemn-shared/misc/EntityRow'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import Pagination from 'stemn-shared/misc/Pagination'
import Tag from 'stemn-shared/misc/Tags/Tag'
import Link from 'stemn-shared/misc/Router/Link'

export default class SiteSearchResults extends Component {
  render() {
    const { results, size, page, location, query, display } = this.props
    const noResults = results && !results.loading && !get(results, ['data', 'length']) > 0
    const noMoreResults = results && results.data && results.data.length < size

    if (display === 'tag') {
      return (
        <div>
          { results && results.data && results.data.map(result => (
            <Link key={ result._id } name="fieldRoute" params={ { fieldId: result.stub } }>
              <Tag className="primary" text={ result.name } style={ { marginBottom: '6px' } } />
            </Link>
          ))}
        </div>
      )
    }
    return (
      <div>
        <div className={ `${classes.results} layout-column` } style={ !results || !results.data ? { minHeight: '100vh' } : {}  }>
          <LoadingOverlay
            show={ !results || results.loading }
            linear
            noOverlay
          />
          { results && results.data && results.data.map(result => (
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
