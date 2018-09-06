import * as cn from 'classnames'
import { get } from 'lodash'
import * as React from 'react'
import EntityRow from 'stemn-shared/misc/EntityRow'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'
import Pagination from 'stemn-shared/misc/Pagination'
import { ProjectRow } from 'stemn-shared/misc/Projects/ProjectRow/ProjectRow'
import { IProject } from 'stemn-shared/misc/Projects/types'
import * as Link from 'stemn-shared/misc/Router/Link'
import Tag from 'stemn-shared/misc/Tags/Tag'
import * as classes from './SiteSearchResults.scss'

export interface ISiteSearchResultsProps {
  size: number,
  type: 'project' | 'user' | 'field',
  location: any,
  page: number,
  results: {
    data: IProject[],
    loading: boolean,
  },
  display?: 'tag' | 'projectRow',
  query?: string,
}

export class SiteSearchResults extends React.Component<ISiteSearchResultsProps> {
  public render () {
    const { results, size, page, location, query, display } = this.props
    const noResults = results && !results.loading && !(get(results, ['data', 'length']) > 0)
    const hasResults = get(results, ['data', 'length']) > 0
    const noMoreResults = results && results.data && results.data.length < size

    const isLoading = !results || results.loading

    if (display === 'tag') {
      return (
        <div>
          { results && results.data && results.data.map((result) => (
            <Link key={result._id} name='fieldRoute' params={{ fieldId: result.stub }}>
              <Tag className='primary' text={result.name} style={{ marginBottom: '6px' }} />
            </Link>
          ))}
        </div>
      )
    }
    return (
      <div>
        <div
          className={cn(classes.results, 'layout-column', (display === 'projectRow' && !isLoading && hasResults) ? classes.projectRow : '')}
          style={!results || !results.data ? { minHeight: '100vh' } : {}}
        >
          <LoadingOverlay
            show={isLoading}
            linear={true}
            noOverlay={true}
          />
          { display === 'projectRow'
            ? results && results.data && results.data.map((result) => (
              <ProjectRow
                key={result._id}
                size='wide'
                project={{ data: result }}
                className={classes.result}
              />
            ))
            : results && results.data && results.data.map((result) => (
              <EntityRow
                key={result._id}
                data={result}
                query={query}
                className={classes.result}
              />
            ))
          }
          {noResults && <div className='layout-column flex layout-align-center-center text-title-5'>No Search Results</div>}
        </div>
        <Pagination
          path={location.pathname}
          query={location.query}
          page={page}
          noMoreResults={noMoreResults}
        />
      </div>
    )
  }
}
