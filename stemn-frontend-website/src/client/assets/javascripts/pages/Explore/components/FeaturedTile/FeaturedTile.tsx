import * as cn from 'classnames'
import * as React from 'react'
import { Link } from 'react-router'
import * as s from './FeaturedTile.scss'

export interface IFeaturedTileProps {
  title: string,
  description: string,
  link: string,
  image: string,
}

const CmsLink = ({ link, children, ...otherProps }: { link: string, children: any, [otherProps: string]: any }) => {
  if (link.includes('https://stemn.com')) {
    return <Link to={link.replace('https://stemn.com', '')} {...otherProps}>{children}</Link>
  } else {
    return <a href={link} {...otherProps} target='_blank'>{children}</a>
  }
}

export const FeaturedTile = ({ title, description, link, image }: IFeaturedTileProps) => {
  return (
    <CmsLink className={s.tile} link={link}>
      <div className={s.image} style={{ backgroundImage:  `url(${image})` }}/>
      <div className={s.content}>
        <a className={cn('link-primary', s.title)}>{title}</a>
        <div className={s.blurb}>{description}</div>
      </div>
    </CmsLink>
  )
}

export const FeaturedTileRow = ({ title, description, link, image }: IFeaturedTileProps) => {
  return (
    <CmsLink className={cn(s.rowTile, 'layout-row')} link={link}>
      <div className={s.rowImage} style={{ backgroundImage: `url(${image})` }}/>
      <div className={cn(s.content, 'flex')}>
        <div className={cn('link-primary', s.title)}>{title}</div>
        <div className={cn(s.blurb, 'text-ellipsis')}>{description}</div>
      </div>
    </CmsLink>
  )
}
