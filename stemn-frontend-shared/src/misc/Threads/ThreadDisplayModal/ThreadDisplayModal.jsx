import React from 'react'
import moment from 'moment'

import cn from 'classnames'
import classes from './ThreadDisplayModal.css'

import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import LabelSelect from 'stemn-shared/misc/Threads/LabelSelect/LabelSelect.jsx'
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx'
import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker.jsx'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import ThreadTimelineEmpty from 'stemn-shared/misc/Threads/ThreadTimelineEmpty'

export default class ThreadDisplayModal extends React.Component {
  showLabelEditModal = () => {
    this.props.showLabelEditModal({
      boardId: this.props.thread.data.board,
    })
  };

  toggleComplete = ({ model, value }) => {
    this.props.toggleComplete({
      threadId: this.props.thread.data._id,
      model,
      value,
    })
    this.updateThread()
  };

  updateThread = () => {
    setTimeout(() => this.props.updateThread({ thread: this.props.thread.data }), 1)
  };

  deleteThread = () => {
    this.props.deleteThread({
      threadId: this.props.thread.data._id,
      boardId: this.props.thread.data.board,
    })
    this.props.modalConfirm()
  };

  render() {
    const {
      threadId,
      thread,
      board,
      entityModel,
      project,
      timeline,
      timelineCacheKey,
    } = this.props

    const getMain = () => {
      const menu = [{
        label: 'Delete Thread',
        onClick: this.deleteThread,
      }]

      return (
        <div className="layout-column flex">
          <div className={ classes.header }>
            <div className="layout-row layout-align-start-center">
              <Checkbox
                model={ `${entityModel}.data.complete` }
                value={ thread.data.complete }
                changeAction={ this.toggleComplete }
                className="text-primary"
                circle
              />
              <div className="text-title-4 flex" style={ { marginLeft: '15px' } }>
                <Textarea
                  model={ `${entityModel}.data.name` }
                  onChange={ this.updateThread }
                  value={ thread.data.name }
                  className="input-plain"
                  type="text"
                  placeholder="Thread description"
                />
              </div>
              <Popover preferPlace="below">
                <SimpleIconButton>
                  <MdMoreHoriz size="20px" />
                </SimpleIconButton>
                <PopoverMenuList menu={ menu } />
              </Popover>
            </div>
            <div className="text-grey-3" style={ { padding: '15px 0 20px' } }>
              Created {moment(thread.data.created).fromNow()} <b className="text-interpunct" /> By <a className="link-primary">{thread.data.owner.name}</a>
            </div>
          </div>
          <div className={ `${classes.timeline} layout-column flex` }>
            { timeline && timeline.length > 0 &&
              <TimelineVertical
                className={ classes.timeline }
                items={ timeline }
                timelineCacheKey={ timelineCacheKey }
                entity={ board }
                type="thread"
              />
            }
            { timeline && timeline.length === 0 &&
              <ThreadTimelineEmpty className="flex" />
            }
          </div>
          <div className={ classes.newComment }>
            <CommentNew
              threadId={ threadId }
              timelineCacheKey={ timelineCacheKey }
            />
          </div>
        </div>
      )
    }
    
    const getSidebar = () => (
      <div className="layout-column flex">
        <div className={ classes.well }>
          <div className={ `${classes.settingTitle} text-mini-caps layout-row layout-align-start-center` }>
            <div className="flex">Labels</div>
            <a className={ classes.add } title="Edit labels" onClick={ this.showLabelEditModal }>+</a>
          </div>
          <div style={ { maxHeight: '200px', overflowY: 'auto' } }>
            {board && board.data && board.data.labels
              ?
                <LabelSelect
                model={ `${entityModel}.data.labels` }
                value={ thread.data.labels }
                onChange={ this.updateThread }
                labelInfo={ board.data.labels }
              />
              : ''
            }
          </div>
        </div>
        <div className={ classes.well }>
          <div className={ `${classes.settingTitle} text-mini-caps layout-row layout-align-start-center` }>
            <div className="flex">Asignees</div>
          </div>
          <div style={ { padding: '15px' } }>
            <UserSelect
              model={ `${entityModel}.data.users` }
              onChange={ this.updateThread }
              value={ thread.data.users }
              users={ project.data.team }
            />
          </div>
        </div>
        <div className={ classes.well }>
          <div className={ `${classes.settingTitle} text-mini-caps layout-row layout-align-start-center` }>
              Due Date
          </div>
          <div style={ { padding: '15px' } }>
            <DatePicker
              model={ `${entityModel}.data.due` }
              onChange={ this.updateThread }
              value={ thread.data.due }
            />
          </div>
        </div>
      </div>
    )

    return (
      <div className={ cn(classes.threadDisplayModal, 'layout-column') }>
        <div className="layout-row flex">
          <div className="flex-70 layout-column rel-box">
            <LoadingOverlay show={ !thread || !thread.data || !project || !project.data } />
            {thread && thread.data && project && project.data ? getMain() : null}
          </div>
          <div className={ `${classes.sidebar} flex` }>
            {thread && thread.data && project && project.data ? getSidebar() : null}
          </div>
        </div>
      </div>
    )
  }
}
