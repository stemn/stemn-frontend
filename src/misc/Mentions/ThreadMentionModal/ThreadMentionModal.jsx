import React, { Component } from 'react';
import classNames from 'classnames';
import classes from './ThreadMentionModal.css';
import howMany from 'stemn-shared/utils/strings/howMany.js';
import Input from 'stemn-shared/misc/Input/Input/Input';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import ThreadRow from './ThreadRow/ThreadRow.jsx';
import MdSearch from 'react-icons/md/search';
import { filterBoard, getAllThreads } from 'stemn-shared/misc/Threads/Threads.utils.js';
import ThreadsFilterMenu from 'stemn-shared/misc/Threads/ThreadsFilterMenu/ThreadsFilterMenu.jsx';
import Popover from 'stemn-shared/misc/Popover';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import { values } from 'lodash'
import { newMention } from 'stemn-shared/misc/Mentions/Mentions.utils'

const getMentionsFromObject = (mentionsObject, threads) => {
  return Object.keys(mentionsObject).map(threadId => newMention({
    entityId: threadId,
    display: threads[threadId].data.name,
    mentionType: mentionsObject[threadId] === 'complete' ? 'thread-complete' : 'thread'
  })
)}

const countMentions = (mentions, type) => values(mentions).filter(mentionType => mentionType === type).length

export default class ThreadMentionModal extends Component {
  componentWillMount() {
    if(!this.props.board || !this.props.board.data){
      this.props.getBoards({
        projectId: this.props.projectId
      })
    }
  }
  submit = () => {
    const { mentions, mentionsModel, threads } = this.props
    // Get the mentions
    const mentionArray = getMentionsFromObject(mentions, threads);
    // Clear mentions
    this.props.storeChange(mentionsModel, {})
    // Return the results
    this.props.modalConfirm({ mentions: mentionArray });
  }
  cancel = () => {
    this.props.modalCancel();
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
  render() {
    const { threads, board, mentions, boardModel } = this.props;

    const getThreads = () => {
      const filteredBoard = filterBoard(board, threads, board.searchString);
      const numThreads = getAllThreads(board.data.groups).length;
      const numFilteredThreads = getAllThreads(filteredBoard.data.groups).length;

      if(numThreads == 0 || numFilteredThreads == 0){
        return (
          <div className="flex layout-column layout-align-center-center text-center">
            {numThreads == 0
              ? <div style={{width: '100%'}}>This project has no threads. Add some.</div>
              : <div style={{width: '100%'}}>No results, <a className="text-primary" onClick={() => this.props.storeChange(`${boardModel}.searchString`, '')}>clear search filter.</a></div>
            }
          </div>
        )
      }
      else{
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
                /> )
              ) }
            </div>)}
          </div>
        )
      }
    }

    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">
          Add threads to a commit:
        </div>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{howMany({count: countMentions(mentions, 'complete'), adj: 'complete'}, {count: countMentions(mentions, 'related'), adj: 'related'}, 'thread')}</div>
          <div className={classes.search}>
            <Input
              model={`${boardModel}.searchString`}
              value={board.searchString}
              className="dr-input"
              placeholder="Search threads"
            />
            <Popover preferPlace="right" trigger="hoverDelay">
              <MdSearch size="20"/>
              <div><ThreadsFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/></div>
            </Popover>
          </div>
        </div>
        <div className="layout-column flex rel-box">
          <LoadingOverlay show={!board || !board.data} />
          { board && board.data ? getThreads() : null }
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Threads</Button>
        </div>
      </div>
    )
  }
}



