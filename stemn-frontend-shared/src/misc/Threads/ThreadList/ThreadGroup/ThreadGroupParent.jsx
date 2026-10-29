import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FlipMove from 'stemn-shared/misc/FlipMove'

export default class ThreadGroupParent extends React.Component {
  render() {
    const { children, layout } = this.props
    return (
      <DndProvider backend={HTML5Backend}>
        <FlipMove
          enterAnimation="none"
          leaveAnimation="none"
          duration={200}
          className={layout === 'list' ? 'layout-column flex' : 'layout-row flex'}
        >
          {children}
        </FlipMove>
      </DndProvider>
    )
  }
}
