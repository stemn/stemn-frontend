// Component Core
import React from 'react'
import PropTypes from 'prop-types'

// Styles
import cn from 'classnames'
import styles from './Timeline.css'

import { orderByTime } from './Timeline.utils'

// Sub Components
import MoreDots from './MoreDots/MoreDots.jsx'
import MoreButton from './MoreButton/MoreButton.jsx'
import TimelineInner from './TimelineInner/TimelineInner.jsx'


// /////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  items: PropTypes.array.isRequired,

  selected: PropTypes.string,
  isSelected: PropTypes.func, // function of the form (item) => return true||false

  onSelect: PropTypes.func,
  preferPlace: PropTypes.string,
  size: PropTypes.string, // 'sm'

  style: PropTypes.object,
  className: PropTypes.string,
}

class Component extends React.Component {
  state = {
    page: 0,
    numPages: 1,
  };

  scroll = (direction) => {
    if (direction === 'left') {
      this.setState({ page: this.state.page + 1 })
    } else if (direction === 'right' && this.state.page > 0) {
      this.setState({ page: this.state.page - 1 })
    }
  };

  getRefInner = (ref) => {
    if (ref) {
      this.refInner = ref
      this.tryGetPages()
    }
  };

  getRefOuter = (ref) => {
    if (ref) {
      this.refOuter = ref
      this.tryGetPages()
    }
  };

  tryGetPages = () => {
    // If we have both refs, we can get the number of pages.
    if (this.refOuter && this.refInner) {
      const contentWidth = this.refInner.offsetWidth
      const containerWidth = this.refOuter.offsetWidth
      const numPages = Math.ceil(contentWidth / containerWidth)
      this.setState({ numPages })
    }
  };

  render() {
    const { items, selected, isSelected, onSelect, preferPlace, style, className, size } = this.props
    const { page, numPages } = this.state
    const moreLeft  = numPages - 1 > page
    const moreRight = page > 0

    // Order the items by the timestamp
    const itemsOrdered = orderByTime(items).reverse()

    return (
      <div className={ cn(styles.timeline, className, { [styles.small]: size === 'sm' }) } style={ style }>
        <div className="rel-box">
          <div className={ styles.line }>
            {moreLeft  ? <MoreButton title="Older events" onClick={ () => this.scroll('left') } side="left" /> : ''}
            {moreRight ? <MoreButton title="Newer events" onClick={ () => this.scroll('right') } side="right" /> : ''}
            {moreLeft  ? <MoreDots side="left" /> : ''}
            {moreRight ? <MoreDots side="right" /> : ''}
          </div>
          <div ref={ this.getRefOuter } className={ styles.dotsOverflow }>
            { items && items.length > 0
              ? <TimelineInner
                onSelect={ onSelect }
                page={ page }
                items={ itemsOrdered }
                selected={ selected }
                isSelected={ isSelected }
                preferPlace={ preferPlace }
                refInner={ this.getRefInner }
                size={ size }
              />
              : null }
          </div>
        </div>
      </div>
    )
  }
}


Component.propTypes = propTypesObject


export default Component
