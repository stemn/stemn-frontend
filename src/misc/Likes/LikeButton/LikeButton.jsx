import React, { Component, PropTypes } from 'react'

import classNames from 'classnames'
import classes from './LikeButton.css'
import MdStar from 'react-icons/md/star'
import MdStarBorder from 'react-icons/md/star-border'

export default class LikeButton extends Component {
  static propTypes = {
    checkIsLiked: PropTypes.func.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    entityId: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
  }

  componentWillMount = () => {
    const { checkIsLiked, entityId } = this.props
    checkIsLiked(entityId);
  }

  toggleLike = () => {
    const { active, unlike, like, entityId, checkIsLiked } = this.props
    if (active) {
      unlike(entityId)
    } else {
      like(entityId)
    }
  }

  render() {
    const { className, like, unlike, active, entityId, number, entityType, checkIsLiked, ...otherProps } = this.props
    return (
      <div className={ classNames(classes.button, className) } { ...otherProps } onClick={ this.toggleLike }>
        <div className={ classNames(classes.main) }>
          { active
          ? <MdStar />
          : <MdStarBorder /> }
          { active
          ? 'Starred'
          : 'Star' }
        </div>
        <div className={ classes.count }>
          { number }
        </div>
      </div>
    )
  }
}
