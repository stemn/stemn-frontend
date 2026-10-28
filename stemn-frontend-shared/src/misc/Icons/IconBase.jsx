import React from 'react'

/**
 * Drop-in replacement for the (dead) `react-icon-base` package used by
 * react-icons v2. Renders an inline svg sized to `size` (default 1em).
 */
const IconBase = ({ children, color, size, style, width, height, ...props }) => {
  const computedSize = size || '1em'
  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      height={ height || computedSize }
      width={ width || computedSize }
      { ...props }
      style={ { verticalAlign: 'middle', color, ...style } }
    >
      { children }
    </svg>
  )
}

export default IconBase
