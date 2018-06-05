import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import FlipMove from 'react-flip-move'

@DragDropContext(HTML5Backend)
export default class ThreadGroupParent extends React.Component {
  render() {
    const { children, layout } = this.props
    return (
      <FlipMove
        enterAnimation="none"
        leaveAnimation="none"
        duration={ 200 }
        className={ layout == 'list' ? 'layout-column flex' : 'layout-row flex' }
      >
        {children}
      </FlipMove>
    )
  }
}
