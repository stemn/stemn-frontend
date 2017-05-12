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
      page: 0,
      numPages: 1
    }
  },
  scroll(direction){
    if(direction == 'left'){
      this.setState({ page : this.state.page + 1})
    }
    else if (direction == 'right' && this.state.page > 0){
      this.setState({page : this.state.page - 1})
    }
  },
  getNumPages(){
    const contentWidth = this.refs.inner.refs.inner.offsetWidth;
    const containerWidth = this.refs.container.offsetWidth;
    const numPages = Math.ceil(contentWidth / containerWidth);
    this.setState({numPages});
  },
  componentDidMount(){
    setTimeout(this.getNumPages, 100);
  },
  render() {
    const { items, selected, isSelected, onSelect, preferPlace, style, className, size } = this.props;
    const { page, numPages } = this.state;
    const numberToShow = 15;
    const moreLeft  = numPages - 1 > page;
    const moreRight = page > 0;

    // Order the items by the timestamp
    const itemsOrdered = orderBy(items, item => (new Date(item.timestamp)).getTime(), 'asc');

    return (
      <div className={classNames(styles.timeline, className, {[styles.small]: size == 'sm'})} style={style}>
        <div className="rel-box">
          <div className={styles.line}>
            {moreLeft  ? <MoreButton title="Older events" onClick={()=>this.scroll('left')} side="left"/> : ''}
            {moreRight ? <MoreButton title="Newer events" onClick={()=>this.scroll('right')} side="right"/> : ''}
            {moreLeft  ? <MoreDots side="left" /> : ''}
            {moreRight ? <MoreDots side="right" /> : ''}
          </div>
          <div ref="container" className={styles.dotsOverflow}>
            { items && items.length > 0
            ? <TimelineInner
                ref="inner"
                onSelect={onSelect}
                page={page}
                items={itemsOrdered}
                selected={selected}
                isSelected={isSelected}
                preferPlace={preferPlace}
                size={size}>
              </TimelineInner>
            : null }
          </div>
        </div>
      </div>
    );
  }
});


Component.propTypes = propTypesObject;


export default Component
