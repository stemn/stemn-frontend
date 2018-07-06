import React from 'react'
import { connect } from 'react-redux'
import { moveGroup, moveThread, beginDrag, endDrag, newThread, newGroup, deleteGroupConfirm, updateGroup } from '../Threads.actions.js'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'

import ThreadGroupParent     from './ThreadGroup/ThreadGroupParent.jsx'
import ThreadGroupWrapped    from './ThreadGroup/ThreadGroupWrapped.jsx'
import ThreadGroup           from './ThreadGroup/ThreadGroup.jsx'
import ThreadListItemParent  from './ThreadListItem/ThreadListItemParent.jsx'
import ThreadListItemWrapped from './ThreadListItem/ThreadListItemWrapped.jsx'
import ThreadListItem        from './ThreadListItem/ThreadListItem.jsx'
import Input from 'stemn-shared/misc/Input/Input/Input'

import cn from 'classnames'
import classes from './ThreadList.css'

export class NewItem extends React.Component {
  render() {
    const { model, value, submitFn, placeholder, box, style } = this.props
    return (
      <form style={ style } name="form" onSubmit={ submitFn }>
        <Input 
          model={ model } 
          value={ value }
          className={ box ? classes.newItemBox : classes.newItem } 
          type="text" placeholder={ placeholder }
        />
      </form>
    )
  }
}

export class ThreadList extends React.Component {
  componentWillMount() {
    this.props.joinRoom({
      room: this.props.board.data._id,
      type: 'board',
    })
  }

  componentWillUnmount() {
    this.props.leaveRoom({
      room: this.props.board.data._id,
      type: 'board',
    })
  }

  moveGroup = ({ group, destinationGroup, after, save }) => {
    this.props.moveGroup({
      boardId: this.props.board.data._id,
      group,
      destinationGroup,
      after,
      save,
    })
  };

  moveCard = ({ thread, destinationThread, destinationGroup, after, save }) => {
    this.props.moveThread({
      boardId: this.props.board.data._id,
      thread,
      destinationThread,
      destinationGroup,
      after,
      save,
    })
  };

  beginDrag = (threadId) => {
    this.props.beginDrag({
      boardId: this.props.board.data._id,
      threadId,
    })
  };

  endDrag = (threadId) => {
    this.props.endDrag({
      boardId: this.props.board.data._id,
      threadId,
    })
  };

  newThread = (event, groupId) => {
    event.preventDefault()
    this.props.newThread({
      projectId: this.props.board.data.project,
      thread: {
        name: this.props.board.newThreadString[groupId],
        group: groupId,
        board: this.props.board.data._id,
      },
    })
  };

  newGroup = (event) => {
    event.preventDefault()
    this.props.newGroup({
      boardId: this.props.board.data._id,
      group: {
        name: this.props.board.newGroupString,
      },
    })
  };

  deleteGroup = (groupId) => {
    this.props.deleteGroupConfirm({
      boardId: this.props.board.data._id,
      groupId,
    })
  };

  updateGroup = (group) => {
    this.props.updateGroup({
      group,
    })
  };

  render() {
    const { board, layout, className } = this.props
    const entityModel = `threads.boards.${board.data._id}`

    const outerClasses = cn(className, layout === 'board' ? 'layout-column flex' : 'flex')
    const outerStyles = layout === 'board' ? { overflowX: 'scroll' } : { overflowY: 'scroll' }
    return (
      <div className={ outerClasses } style={ outerStyles }>
        <ThreadGroupParent layout={ layout }>
          { board.data.groups.map((group, groupIndex) =>
            <ThreadGroupWrapped
              key={ group._id }
              index={ groupIndex }
              id={ group._id }
              item={ group }
              groups={ board.data.groups.map(group => group._id) }
              moveGroup={ this.moveGroup }
              layout={ layout }
            >
              <ThreadGroup
                item={ group }
                layout={ layout }
                entityModel={ `${entityModel}.data.groups[${groupIndex}]` }
                deleteGroup={ () => this.deleteGroup(group._id) }
                updateGroup={ () => this.updateGroup(group) }
              >
                <ThreadListItemParent
                  groupId={ group._id }
                  moveCard={ this.moveCard }
                  threads={ group.threads }
                  layout={ layout }
                >
                  { group.threads ? group.threads.map((threadId, cardIndex) =>
                    <ThreadListItemWrapped
                      index={ cardIndex }
                      id={ threadId }
                      key={ threadId }
                      item={ threadId }
                      groupId={ group._id }
                      threads={ group.threads }
                      moveCard={ this.moveCard }
                      beginDrag={ this.beginDrag }
                      endDrag={ this.endDrag }
                    >
                      <ThreadListItem item={ threadId } draggable layout={ layout } />
                    </ThreadListItemWrapped>,
                  ) : ''}
                  <NewItem
                    style={ layout === 'list' ? { marginLeft: '60px', zIndex: '1', position: 'relative' } : { zIndex: '1', position: 'relative' } }
                    model={ `${entityModel}.newThreadString.${group._id}` }
                    value={ board.newThreadString ? board.newThreadString[group._id] : '' }
                    placeholder="New Thread"
                    submitFn={ event => this.newThread(event, group._id) }
                    box={ layout === 'board' }
                  />
                </ThreadListItemParent>
              </ThreadGroup>
            </ThreadGroupWrapped>,
          )}
          <div>
            <ThreadGroup layout={ layout } simpleGroup>
              <NewItem
                style={ { zIndex: '1', position: 'relative' } }
                model={ `${entityModel}.newGroupString` }
                value={ board.newGroupString }
                placeholder="New Group"
                submitFn={ this.newGroup }
                box={ layout === 'board' }
              />
            </ThreadGroup>
          </div>
        </ThreadGroupParent>
      </div>
    )
  }
}

// //////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {}
}

const mapDispatchToProps =  {
  joinRoom,
  leaveRoom,
  moveGroup,
  moveThread,
  beginDrag,
  endDrag,
  newThread,
  newGroup,
  deleteGroupConfirm,
  updateGroup,
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList)
