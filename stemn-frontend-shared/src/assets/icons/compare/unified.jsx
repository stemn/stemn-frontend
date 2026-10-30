import React from 'react'
import IconBase from 'stemn-shared/misc/Icons/IconBase'

// two overlapping frames: revisions A and B drawn in one view
const UnifiedIcon = (props) => {
  return (
    <IconBase viewBox="0 0 24 24" {...props}>
      <path d="M1.125,1.125v15.5h6.25v6.25h15.5v-15.5h-6.25v-6.25H1.125z M3.125,3.125h11.5v4.25h-7.25v7.25H3.125V3.125z M9.375,9.375h5.25v5.25h-5.25V9.375z M16.625,9.375h4.25v11.5H9.375v-4.25h7.25V9.375z" />
    </IconBase>
  )
}

export default UnifiedIcon
