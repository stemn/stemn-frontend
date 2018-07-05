import React, { Component } from 'react'
import { filterBoard, getAllThreads } from '../Threads.utils.js'
import { has } from 'lodash'

import classes from './ThreadsDisplay.css'

import ThreadList from '../ThreadList/ThreadList.jsx'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import Guide from 'stemn-shared/misc/Guide/Guide'
import cardsColumns from '../graphics/cards-columns.svg'
import cardsStacked from '../graphics/cards-stacked.svg'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import ThreadFilterUser from 'stemn-shared/misc/Threads/ThreadFilters/ThreadFilterUser'
import ThreadFilterStatus from 'stemn-shared/misc/Threads/ThreadFilters/ThreadFilterStatus'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export default class ThreadsDisplay extends Component {
  state = {
    hideGuide: false,
  }
  changeInput = ({ value: filterString }) => {
    const { setFilter, filterCacheKey, filterModel } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterString,
      filterModel,
      location: 'replace',
    })
  }
  getStarted = (toState) => {
    this.setState({ hideGuide: true })
  }
  setLayout = (layout) => {
    this.props.changeLayout({
      layout,
      boardId: this.props.board.data._id,
    })
  }
  render() {
    const {
      threads,
      board,
      project,
      filter,
      filterModel,
      filterCacheKey,
      setFilter,
      projectBoards,
    } = this.props
    const { hideGuide } = this.state

    const layoutOptions = [{
      name: 'List',
      value: 'list',
      onClick: () => this.setLayout('list'),
    }, {
      name: 'Board',
      value: 'board',
      onClick: () => this.setLayout('board'),
    }]


    const guideTemplate = () => {
      const guideInfo = [{
        title: 'Drag and drop to organize your work',
        description: 'Organize thread cards on a kanban-style board. Add due-dates, labels, file references and collaborate with teammates.',
        image: cardsColumns,
      }, {
        title: 'Track threads from beginning to end',
        description: 'See what your team has worked on. Threads are linked to files as they are completed. View files before and after the thread was completed.',
        image: cardsStacked,
      }]
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={ guideInfo[0] } />
            <Guide data={ guideInfo[1] } />
          </div>
          <div className="layout-row layout-align-center">
            <Button className="primary lg" onClick={ this.getStarted }>Get started with Threads</Button>
          </div>
        </div>
      )
    }
    const threadsTemplate = () => {
      const layout = board && board.layout === 'list' ? 'list' : 'board'
      return (
        <div className="layout-column flex">
          <div className={ `${classes.header} layout-row layout-align-start-center` }>
            <SearchInput
              changeAction={ this.changeInput }
              value={ filter.string }
              className={ classes.search }
              type="text"
              placeholder="Search threads"
            />
            <div className="flex" />
            <ThreadFilterUser
              filter={ filter }
              filterModel={ filterModel }
              filterCacheKey={ filterCacheKey }
              setFilter={ setFilter }
              project={ project }
              style={ { margin: '0 15px' } }
            />
            <ThreadFilterStatus
              filter={ filter }
              filterModel={ filterModel }
              filterCacheKey={ filterCacheKey }
              setFilter={ setFilter }
              style={ { marginRight: '15px' } }
            />
            <PopoverDropdown
              className="primary"
              value={ layout }
              options={ layoutOptions }
            >
              Layout:&nbsp;
            </PopoverDropdown>
          </div>
          <ThreadList
            className={ classes.threads }
            board={ filterBoard(board, threads, filter.object) }
            layout={ layout }
          />
        </div>
      )
    }

    const getTemplate = () => {
      const numThreads = has(board, 'data.groups') ? getAllThreads(board.data.groups).length : ''
      if (numThreads === 0 && !hideGuide) {
        return guideTemplate()
      } else if (has(board, 'data.groups')) {
        return threadsTemplate()
      }
      
      return null
    }

    const isLoading = !projectBoards || (projectBoards && projectBoards.loading && !has(board, 'data.groups'))
    return (
      <div className="layout-column flex rel-box">
        <LoadingOverlay show={ isLoading } />
        {!isLoading ? getTemplate() : null}
      </div>
    )
  }
}
