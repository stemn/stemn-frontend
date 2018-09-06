import React, { Component } from 'react'
import classes from './ThreadMentionModal.css'
import howMany from 'stemn-shared/utils/strings/howMany.js'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import ThreadRow from './ThreadRow/ThreadRow.jsx'
import { filterBoard, getAllThreads } from 'stemn-shared/misc/Threads/Threads.utils.js'
import ThreadFilterMenu from 'stemn-shared/misc/Threads/ThreadFilters/ThreadFilterMenu'
import Popover from 'stemn-shared/misc/Popover'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { values } from 'lodash'
import { newMention } from 'stemn-shared/misc/Mentions/Mentions.utils'
import MdFilterList from 'react-icons/md/filter-list'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'

const getMentionsFromObject = (mentionsObject, threads) => Object.keys(mentionsObject).map(threadId => newMention({
  entityId: threadId,
  display: threads[threadId].data.name,
  mentionType: mentionsObject[threadId] === 'complete' ? 'thread-complete' : 'thread',
}),
)

const countMentions = (mentions, type) => values(mentions).filter(mentionType => mentionType === type).length

export default class ThreadMentionModal extends Component {
  componentWillMount() {
    if (!this.props.board || !this.props.board.data) {
      this.props.getBoards({
        projectId: this.props.projectId,
      })
    }
  }
  submit = () => {
    const { mentions, mentionsModel, threads } = this.props
    // Get the mentions
    const mentionArray = getMentionsFromObject(mentions, threads)
    // Clear mentions
    this.props.storeChange(mentionsModel, {})
    // Return the results
    this.props.modalConfirm({ mentions: mentionArray })
  }
  cancel = () => {
    this.props.modalCancel()
  }
  setMention = ({ status, threadId }) => {
    const { mentions, storeChange, mentionsModel } = this.props
    const currentStatus = mentions[threadId]
    if (status === currentStatus) {
      storeChange(`${mentionsModel}.${threadId}`, '')
    } else {
      storeChange(`${mentionsModel}.${threadId}`, status)
    }
  }
  changeInput = ({ value: filterString }) => {
    const { setFilter, filterCacheKey, filterModel } = this.props
    setFilter({
      cacheKey: filterCacheKey,
      filterString,
      filterModel,
    })
  }
  render() {
    const { threads, auth, board, mentions, boardModel, filter, filterModel, filterCacheKey, setFilter } = this.props

    const getThreads = () => {
      const filteredBoard = filterBoard(board, threads, filter.object)
      const numThreads = getAllThreads(board.data.groups).length
      const numFilteredThreads = getAllThreads(filteredBoard.data.groups).length

      if (numThreads === 0 || numFilteredThreads === 0) {
        return (
          <div className="flex layout-column layout-align-center-center text-center">
            {numThreads === 0
              ? <div style={ { width: '100%' } }>This project has no threads. Add some.</div>
              : <div style={ { width: '100%' } }>No results, <a className="text-primary" onClick={ () => this.props.storeChange(`${boardModel}.searchString`, '') }>clear search filter.</a></div>
            }
          </div>
        )
      }
      
      return (
        <div className="flex scroll-box">
          { filteredBoard.data.groups.map((group, idx) => <div key={ idx }>
            { group.threads.map(threadId => (
              <ThreadRow
                key={ threadId }
                threadId={ threadId }
                status={ mentions[threadId] }
                toggleComplete={ () => this.setMention({ status: 'complete', threadId }) }
                toggleRelated={ () => this.setMention({ status: 'related', threadId }) }
              />),
            ) }
          </div>)}
        </div>
      )
    }

    return (
      <div className={ `${classes.modal} layout-column` }>
        <div className="modal-title">
          Add threads to a commit:
        </div>
        <div className={ `${classes.header} layout-row layout-align-start-center` }>
          <div className="flex">{howMany({ count: countMentions(mentions, 'complete'), adj: 'closed' }, { count: countMentions(mentions, 'related'), adj: 'related' }, 'thread')}</div>
          <SearchInput
            className={ classes.search }
            changeAction={ this.changeInput }
            value={ filter.string }
            type="text"
            placeholder="Search threads"
          />
          <Popover preferPlace="right" trigger="hoverDelay">
            <SimpleIconButton><MdFilterList size="20" /></SimpleIconButton>
            <div>
              <ThreadFilterMenu
                auth={ auth }
                filter={ filter }
                filterModel={ filterModel }
                filterCacheKey={ filterCacheKey }
                setFilter={ setFilter }
              />
            </div>
          </Popover>
        </div>
        <div className="layout-column flex rel-box">
          <LoadingOverlay show={ !board || !board.data } />
          { board && board.data ? getThreads() : null }
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1" />
          <Button style={ { marginRight: '10px' } } onClick={ this.cancel }>Cancel</Button>
          <Button className="primary" onClick={ this.submit }>Add Threads</Button>
        </div>
      </div>
    )
  }
}

