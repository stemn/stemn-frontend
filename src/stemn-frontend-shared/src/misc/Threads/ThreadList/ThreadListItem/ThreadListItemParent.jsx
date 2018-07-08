import React from 'react'
import EmptyWrapped from './EmptyWrapped.jsx'
import FlipMove from 'react-flip-move/dist/react-flip-move.js'

export default class ThreadListItemParent extends React.Component {
  render() {
    const { groupId, threads, children, moveCard, layout } = this.props
    return (
      <div style={ layout === 'list' ? { position: 'relative' } : {} }>
        <FlipMove enterAnimation="none" leaveAnimation="none" duration={ 100 }>
          {children}
        </FlipMove>
        {threads && threads.length >= 1 ? null :
          <EmptyWrapped
          layout={ layout }
          moveCard={ moveCard }
          groupId={ groupId }
        />
        }
      </div>
    )
  }
}
