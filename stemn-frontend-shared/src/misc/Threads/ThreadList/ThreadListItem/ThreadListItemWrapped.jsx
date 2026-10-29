import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { cardHover, cardDrop, beginDrag, endDrag } from './ThreadListItem.drag.config.js'

const ItemTypes = {
  CARD: 'card',
}

export default function ThreadListItemWrapped(props) {
  const { children, id } = props

  // Keep the latest props available to the (memoized) drag/drop specs
  const propsRef = useRef(props)
  propsRef.current = props
  const nodeRef = useRef(null)

  const [, connectDragSource] = useDrag({
    type: ItemTypes.CARD,
    item: () => beginDrag(propsRef.current),
    end: (item, monitor) => endDrag(propsRef.current, monitor),
  })

  const [, connectDropTarget] = useDrop({
    accept: ItemTypes.CARD,
    hover: (item, monitor) => cardHover(propsRef.current, monitor, nodeRef.current),
    drop: (item, monitor) => cardDrop(propsRef.current, monitor),
  })

  const setRef = useCallback((node) => {
    nodeRef.current = node
    connectDragSource(connectDropTarget(node))
  }, [connectDragSource, connectDropTarget])

  return (
    <div ref={ setRef } key={ id }>
      {children}
    </div>
  )
}

ThreadListItemWrapped.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired,
  beginDrag: PropTypes.func.isRequired,
  endDrag: PropTypes.func.isRequired,
}

// style={{transform: 'translate3d(0,0,0)'}}
