// Component Core
import React, { PropTypes } from 'react';

// Styles
import classNames from 'classnames';
import styles from './Timeline.css';

// Sub Components
import MoreDots from './MoreDots/MoreDots.jsx';
import MoreButton from './MoreButton/MoreButton.jsx';
import TimelineInner from './TimelineInner/TimelineInner.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

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
    const { items, selected, isSelected, onSelect, preferPlace, style, className } = this.props;
    const numberToShow = 15;
    const moreLeft  = items ? this.state.page < items.length / numberToShow - 1 : false;
    const moreRight = this.state.page > 0;

    return (
      <div className={classNames(styles.timeline, 'layout-row', className)} style={style}>
        <div className="rel-box flex">
          <div className={styles.line}>
            {moreLeft  ? <MoreButton onClick={()=>this.scroll('left')} side="left"/> : ''}
            {moreRight ? <MoreButton onClick={()=>this.scroll('right')} side="right"/> : ''}
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
                  items={items}
                  selected={selected}
                  isSelected={isSelected}
                  preferPlace={preferPlace}>
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

Component.propTypes = {
  items: PropTypes.array.isRequired,

  selected: PropTypes.string,
  isSelected: PropTypes.function, // function of the form (item) => return true||false

  onSelect: PropTypes.function,
  preferPlace: PropTypes.string,

  style: PropTypes.object,
  className: PropTypes.string,
};


export default Component
