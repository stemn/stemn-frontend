// Component Core
import React, { PropTypes } from 'react';

// Styles
import classNames from 'classnames';
import styles from './Timeline.css';
import { orderBy } from 'lodash';

// Sub Components
import MoreDots from './MoreDots/MoreDots.jsx';
import MoreButton from './MoreButton/MoreButton.jsx';
import TimelineInner from './TimelineInner/TimelineInner.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  items: PropTypes.array.isRequired,

  selected: PropTypes.string,
  isSelected: PropTypes.func, // function of the form (item) => return true||false

  onSelect: PropTypes.func,
  preferPlace: PropTypes.string,
  size: PropTypes.string, // 'sm'

  style: PropTypes.object,
  className: PropTypes.string,
};

const Component = React.createClass({
  getInitialState () {
    return {
      isOpen: false,
      page: 0
    }
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  scroll (direction){
    if(direction == 'left'){
      this.setState({
        page : this.state.page + 1
      })
    }
    else if (direction == 'right' && this.state.page > 0){
      this.setState({
        page : this.state.page - 1
      })
    }
  },
  render() {
    const { items, selected, isSelected, onSelect, preferPlace, style, className, size } = this.props;
    const numberToShow = 15;
    const moreLeft  = items ? this.state.page < items.length / numberToShow - 1 : false;
    const moreRight = this.state.page > 0;

    // Order the items by the timestamp
    const itemsOrdered = orderBy(items, item => (new Date(item.timestamp)).getTime(), 'desc');

    return (
      <div className={classNames(styles.timeline, 'layout-row', className, {[styles.small]: size == 'sm'})} style={style}>
        <div className="rel-box flex">
          <div className={styles.line}>
            {moreLeft  ? <MoreButton title="Older events" onClick={()=>this.scroll('left')} side="left"/> : ''}
            {moreRight ? <MoreButton title="Newer events" onClick={()=>this.scroll('right')} side="right"/> : ''}
            {moreLeft  ? <MoreDots side="left" /> : ''}
            {moreRight ? <MoreDots side="right" /> : ''}
          </div>
          <div className={styles.dotsOverflow}>
            <div className={styles.dotsPosContainer}>
              {items && items.length > 0
                ?
                <TimelineInner
                  numberToShow={numberToShow}
                  onSelect={onSelect}
                  page={this.state.page}
                  items={itemsOrdered}
                  selected={selected}
                  isSelected={isSelected}
                  preferPlace={preferPlace}
                  size={size}>
                </TimelineInner>
                : ''
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Component.propTypes = propTypesObject;


export default Component