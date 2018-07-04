import React, { Component } from 'react'
import classes from './HeroBanner.scss'
import cn from 'classnames'
import { Container } from 'stemn-shared/misc/Layout'

export default class HeroBanner extends Component {
  render() {
    const { children, image, style, className, ...otherProps } = this.props


    const allStyles = image
      ? Object.assign({}, { backgroundImage: `url(${image})` }, style)
      : style

    const allClasses = cn(classes.banner, 'layout-column', className)

    return (
      <section
        className={ allClasses }
        style={ allStyles }
        { ...otherProps }
      >
        <Container className="flex layout-column layout-align-center-center">
          { children }
        </Container>
      </section>
    )
  }
}
