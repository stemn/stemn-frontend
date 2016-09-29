// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import styles from './Timeline.css';

// Sub Components
import MoreDots from './MoreDots/MoreDots.jsx';
import MoreButton from './MoreButton/MoreButton.jsx';
import TimelineInner from './TimelineInner/TimelineInner.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
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
    const { items, selected, onSelect } = this.props;
    const numberToShow = 15;
    const moreLeft  = items ? this.state.page < items.length / numberToShow - 1 : false;
    const moreRight = this.state.page > 0;

    return (
      <div className={styles.timeline +' layout-row'}>
        <div className="rel-box flex">
          <div className={styles.line}>
            {moreLeft  ? <MoreButton onClick={()=>this.scroll('left')} side="left"/> : ''}
            {moreRight ? <MoreButton onClick={()=>this.scroll('right')} side="right"/> : ''}
            {moreLeft  ? <MoreDots side="left" /> : ''}
            {moreRight ? <MoreDots side="right" /> : ''}
          </div>
          <div className={styles.dotsOverflow}>
            <div className={styles.dotsPosContainer}>
              <TimelineInner
                numberToShow={numberToShow}
                onSelect={onSelect}
                page={this.state.page}
                items={items}
                selected={selected}>
              </TimelineInner>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
