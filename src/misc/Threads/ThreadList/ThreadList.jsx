import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ThreadsActions from '../Threads.actions.js';

import ThreadGroupParent     from './ThreadGroup/ThreadGroupParent.jsx';
import ThreadGroupWrapped    from './ThreadGroup/ThreadGroupWrapped.jsx'
import ThreadGroup           from './ThreadGroup/ThreadGroup.jsx'
import ThreadListItemParent  from './ThreadListItem/ThreadListItemParent.jsx'
import ThreadListItemWrapped from './ThreadListItem/ThreadListItemWrapped.jsx'
import ThreadListItem        from './ThreadListItem/ThreadListItem.jsx'
import Input from 'stemn-shared/misc/Input/Input/Input';

import classNames from 'classnames'
import classes from './ThreadList.css';

export const NewItem = React.createClass({
  render() {
    const { model, value, submitFn, placeholder, box, style } = this.props;
    return (
      <form style={style} name="form" onSubmit={submitFn}>
        <Input 
          model={model} 
          value={value}
          className={box ? classes.newItemBox : classes.newItem} 
          type="text" placeholder={placeholder}
        />
      </form>
    )
  }
});

export const ThreadList = React.createClass({
  componentWillMount(){
    this.props.ThreadsActions.websocketJoinBoard({
      boardId: this.props.board.data._id
    })
  },

  componentWillUnmount(){
    this.props.ThreadsActions.websocketLeaveBoard({
      boardId: this.props.board.data._id
    })
  },

  moveGroup({group, destinationGroup, after, save}) {
    this.props.ThreadsActions.moveGroup({
      boardId: this.props.board.data._id,
      group,
      destinationGroup,
      after,
      save
    })
  },
  moveCard({thread, destinationThread, destinationGroup, after, save}) {
    this.props.ThreadsActions.moveThread({
      boardId: this.props.board.data._id,
      thread,
      destinationThread,
      destinationGroup,
      after,
      save
    })
  },
  beginDrag(threadId) {
    this.props.ThreadsActions.beginDrag({
      boardId: this.props.board.data._id,
      threadId,
    })
  },
  endDrag(threadId) {
    this.props.ThreadsActions.endDrag({
      boardId: this.props.board.data._id,
      threadId,
    })
  },
  newThread(event, groupId){
    event.preventDefault();
    this.props.ThreadsActions.newThread({
      boardId: this.props.board.data._id,
      thread: {
        name: this.props.board.newThreadString[groupId],
        group: groupId,
        boardId: this.props.board.data._id
      },
    })
  },
  newGroup(event){
    event.preventDefault();
    this.props.ThreadsActions.newGroup({
      boardId: this.props.board.data._id,
      group: {
        name: this.props.board.newGroupString
      },
    })
  },
  deleteGroup(groupId){
    this.props.ThreadsActions.deleteGroupConfirm({
      boardId: this.props.board.data._id,
      groupId: groupId
    })
  },
  updateGroup(group){
    this.props.ThreadsActions.updateGroup({
      group: group
    })
  },
  render() {
    const { board, layout, className } = this.props;
    const entityModel = `threads.boards.${board.data._id}`;

    const outerClasses = classNames(className, layout == 'board' ? 'layout-column flex' : 'flex')
    const outerStyles = layout == 'board' ? { overflowX : 'scroll' } : { overflowY : 'scroll' }
    return (
      <div className={ outerClasses } style={ outerStyles }>
        <ThreadGroupParent layout={ layout }>
          { board.data.groups.map((group, groupIndex) =>
            <ThreadGroupWrapped
              key={ group._id }
              index={ groupIndex }
              id={ group._id }
              item={ group }
              groups={ board.data.groups.map((group)=>group._id) }
              moveGroup={ this.moveGroup }
              layout={ layout }>
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
                 threads={group.threads}
                 layout={layout}
                >
                  { group.threads ? group.threads.map((threadId, cardIndex) =>
                    <ThreadListItemWrapped
                      index={ cardIndex }
                      id={ threadId }
                      key={ threadId }
                      item={ threadId }
                      groupId={ group ._id }
                      threads={ group.threads }
                      moveCard={ this.moveCard }
                      beginDrag={ this.beginDrag }
                      endDrag={this.endDrag}>
                      <ThreadListItem item={threadId} draggable={true} layout={layout} />
                    </ThreadListItemWrapped>
                  ) : ''}
                  <NewItem
                    style={layout == 'list' ? {marginLeft: '60px', zIndex: '1', position: 'relative'} : {zIndex: '1', position: 'relative'}}
                    model={`${entityModel}.newThreadString.${group._id}`}
                    value={board.newThreadString ? board.newThreadString[group._id] : ''}
                    placeholder="New Thread"
                    submitFn={(event) => this.newThread(event, group._id)}
                    box={layout=='board'}
                  />
                </ThreadListItemParent>
              </ThreadGroup>
           </ThreadGroupWrapped>
          )}
          <div>
            <ThreadGroup layout={layout} simpleGroup={true}>
              <NewItem
                style={{zIndex: '1', position: 'relative'}}
                model={`${entityModel}.newGroupString`}
                value={board.newGroupString}
                placeholder="New Group"
                submitFn={this.newGroup}
                box={layout=='board'}
              />
            </ThreadGroup>
          </div>
        </ThreadGroupParent>
      </div>
    )
  }
});

////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    ThreadsActions: bindActionCreators(ThreadsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList)
