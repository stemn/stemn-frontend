import cn from 'classnames'
import { Link } from 'stemn-shared/routing'
import s from './FeaturedTile.module.scss'

export interface IFeaturedTileProps {
  title: string
  description: string
  link: string
  image: string
}

/** Path of a link to stemn.com itself (rendered as an in-app link), or null for any other site */
const stemnPath = (link: string) => {
  try {
    const url = new URL(link)
    return url.origin === 'https://stemn.com' ? `${url.pathname}${url.search}${url.hash}` : null
  } catch {
    return null
  }
}

const CmsLink = ({ link, children, ...otherProps }: { link: string; children: any; [otherProps: string]: any }) => {
  const path = stemnPath(link)
  if (path !== null) {
    return (
      <Link to={path} {...otherProps}>
        {children}
      </Link>
    )
  } else {
    return (
      <a href={link} {...otherProps} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
}

export const FeaturedTile = ({ title, description, link, image }: IFeaturedTileProps) => {
  return (
    <CmsLink className={s.tile} link={link}>
      <div className={s.image} style={{ backgroundImage: `url(${image})` }} />
      <div className={s.content}>
        <span className={cn('link-primary', s.title)}>{title}</span>
        <div className={s.blurb}>{description}</div>
      </div>
    </CmsLink>
  )
}

export const FeaturedTileRow = ({ title, description, link, image }: IFeaturedTileProps) => {
  return (
    <CmsLink className={cn(s.rowTile, 'layout-row')} link={link}>
      <div className={s.rowImage} style={{ backgroundImage: `url(${image})` }} />
      <div className={cn(s.content, 'flex')}>
        <div className={cn('link-primary', s.title)}>{title}</div>
        <div className={cn(s.blurb, 'text-ellipsis')}>{description}</div>
      </div>
    </CmsLink>
  )
}
