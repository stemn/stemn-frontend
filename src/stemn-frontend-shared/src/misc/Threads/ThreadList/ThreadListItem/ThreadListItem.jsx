// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ThreadsActions from '../../Threads.actions.js'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'

// Component Core
import React from 'react'
import { has } from 'lodash'

// Styles
import cn from 'classnames'
import classes from './ThreadListItem.css'
import loadingClasses from 'stemn-shared/misc/Loading/LoadingPlaceholders/LoadingPlaceholders.css'

// Sub Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import Input from 'stemn-shared/misc/Input/Input/Input'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdOpenInNew from 'react-icons/md/open-in-new'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import DueDate from 'stemn-shared/misc/Threads/ThreadDueDate'
import threadDisplayModalName from 'stemn-shared/misc/Threads/ThreadDisplayModal'


export class ThreadListItem extends React.Component {
  // Mounting
  onMount = (nextProps, prevProps) => {
    if (!prevProps || prevProps.item !== nextProps.item) {
      if (!nextProps.thread || !nextProps.thread.data) {
        nextProps.ThreadsActions.getThread({
          threadId: nextProps.item,
        })
      }
    }
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  updateThread = () => {
    setTimeout(() => this.props.ThreadsActions.updateThread({ thread: this.props.thread.data }), 1)
  };

  toggleComplete = ({ model, value }) => {
    this.props.ThreadsActions.toggleComplete({
      threadId: this.props.thread.data._id,
      model,
      value,
    })
    this.updateThread()
  };

  showModal = () => {
    this.props.ModalActions.showModal({
      modalType: threadDisplayModalName,
      limit: 1,
      modalProps: {
        threadId: this.props.item,
      },
    })
  };

  render() {
    const {
      thread,
      entityModel,
      draggable,
      layout,
      board,
    } = this.props
    if (!thread || !thread.data) {
      if (layout === 'list') {
        return (
          <div className={ loadingClasses.loading }>
            <div className={ cn(classes.listItem, 'layout-row flex layout-align-start-center') }>
              <Checkbox
                className="text-primary"
                circle
              />
              <div className="flex text-ellipsis" style={ { lineHeight: '1.4em' } }>
                Some placeholder hidden with blokk font
              </div>
              <div className={ `${classes.listUser} layout-row layout-align-start-center text-ellipsis` }>
                <UserAvatars users={ [{}] } limit={ 3 } />
              </div>
              <div className={ classes.listDate } />
              <div className={ `${classes.listActions} text-ellipsis layout-row layout-align-end-center` } />
            </div>
          </div>
        )
      }
      
      return (
        <div className={ cn(classes.card, loadingClasses.loading, 'layout-column flex') }>
          <div className={ `${classes.cardBody} layout-row` }>
            <Checkbox className="text-primary" circle />
            <div className={ `${classes.cardText} flex` }>Some placeholder hidden with blokk font</div>
            <UserAvatars users={ [{}] } />
          </div>
          <div className={ `${classes.cardFooter} layout-row layout-align-start-center` } />
        </div>
      )
    }
    if (layout === 'list') {
      return (
        <div className={ cn({ [classes.isDragging]: thread.isDragging && draggable }) }>
          <div className={ cn(classes.listItem, 'layout-row flex layout-align-start-center') }>
            <Checkbox
              title={ thread.data.complete ? 'Mark as open' : 'Mark as closed' }
              model={ `${entityModel}.data.complete` }
              value={ thread.data.complete }
              changeAction={ this.toggleComplete }
              className="text-primary"
              circle
            />
            <div className="flex text-ellipsis" style={ { lineHeight: '1.4em' } }>
              <Input
                model={ `${entityModel}.name` }
                value={ thread.data.name }
                onChange={ this.updateThread }
                className="input-plain"
                type="text"
                placeholder="Thread description" 
              />
            </div>
            { thread.data.labels && thread.data.labels.length > 0 && board && board.data && board.data.labels ?
              <ThreadLabelDots labels={ thread.data.labels } labelInfo={ board.data.labels } tag />
              : null
            }
            <div className={ `${classes.listUser} layout-row layout-align-start-center text-ellipsis` }>
              <UserAvatars className="layout-row" users={ thread.data.users } limit={ 3 } />
            </div>
            <div className={ classes.listDate }>
              { !thread.data.complete ? <DueDate due={ thread.data.due } /> : null }
            </div>
            <div className={ `${classes.listActions} text-ellipsis layout-row layout-align-end-center` }>
              <SimpleIconButton onClick={ this.showModal } title="Show Thread">
                <MdOpenInNew size="20px" />
              </SimpleIconButton>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className={ cn(classes.card, 'layout-column flex') }>
        <div className={ `${classes.cardBody} layout-row` }>
          <Checkbox
            title={ thread.data.complete ? 'Mark as open' : 'Mark as closed' }
            model={ `${entityModel}.data.complete` }
            value={ thread.data.complete }
            changeAction={ this.toggleComplete }
            className="text-primary"
            circle
          />
          <div className={ `${classes.cardText} flex` }>
            <Textarea
              onChange={ this.updateThread }
              model={ `${entityModel}.data.name` }
              value={ thread.data.name }
              className="input-plain"
              type="text"
              placeholder="Thread description"
            />
          </div>
          <UserAvatars className="layout-row" users={ thread.data.users } limit={ 2 } />
        </div>
        <div className={ `${classes.cardFooter} layout-row layout-align-start-center` } onClick={ this.showModal }>
          <div className="flex layout-row layout-align-start-center">
            { thread.data.labels && thread.data.labels.length > 0 && board && board.data && board.data.labels ?
              <ThreadLabelDots labels={ thread.data.labels } labelInfo={ board.data.labels } />
              : null
            }
          </div>
          <div style={ { padding: '0 5px' } }>{ !thread.data.complete ? <DueDate due={ thread.data.due } /> : null }</div>
          <SimpleIconButton title="Show Thread">
            <MdOpenInNew size="20px" />
          </SimpleIconButton>
        </div>
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ threads, projects }, { item }) {
  const thread          = threads.data[item]
  const board         = has(thread, 'data.board') ? threads.boards[thread.data.board] : {}
  const boardModel    = has(thread, 'data.board') ? `threads.boards.${thread.data.board}` : ''
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {}

  return {
    thread,
    entityModel: `threads.data.${item}`,
    board,
    boardModel,
    project,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ThreadsActions: bindActionCreators(ThreadsActions, dispatch),
    ModalActions: bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadListItem)
