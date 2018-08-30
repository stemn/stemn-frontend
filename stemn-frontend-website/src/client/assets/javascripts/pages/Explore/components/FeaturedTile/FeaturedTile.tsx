import * as cn from 'classnames'
import * as React from 'react'
import * as s from './FeaturedTile.scss'

export const FeaturedTile = () => {
  return (
    <div className={ s.tile }>
      <div className={ s.image } style={{ backgroundImage: 'url(https://assets-cdn.github.com/images/modules/explore/spotlight/marsrover.png)' }}/>
      <div className={ s.content }>
        <a className={ cn('link-primary', 'text-title-4') }>Open source Mars rover</a>
        <div className={ s.blurb }>JPL's Open Source Build it yourself Mars Rover</div>
      </div>
    </div>
  )
}

export const FeaturedTileRow = () => {
  return (
    <div className={ cn(s.rowTile, 'layout-row') }>
      <div className={ s.rowImage } style={{ backgroundImage: 'url(https://assets-cdn.github.com/images/modules/explore/spotlight/marsrover.png)' }}/>
      <div className={ cn(s.content, 'flex') }>
        <div className={ cn('link-primary', 'text-title-4') }>Open source Mars rover</div>
        <div className={ cn(s.blurb, 'text-ellipsis') }>JPL's Open Source Build it yourself Mars Rover</div>
      </div>
    </div>
  )
}
