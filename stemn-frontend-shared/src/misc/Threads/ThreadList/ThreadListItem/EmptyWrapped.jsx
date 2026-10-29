import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'
import classes from './EmptyWrapped.module.css'

import { emptyHover } from './ThreadListItem.drag.config.js'

const ItemTypes = {
  CARD: 'card',
}

export default function EmptyWrapped(props) {
  const { layout } = props

  // Keep the latest props available to the (memoized) drop spec
  const propsRef = useRef(props)
  propsRef.current = props

  const [, connectDropTarget] = useDrop({
    accept: ItemTypes.CARD,
    hover: (item, monitor) => emptyHover(propsRef.current, monitor),
  })

  return <div ref={connectDropTarget} className={layout === 'board' ? classes.wrapperBoard : classes.wrapperList} />
}
