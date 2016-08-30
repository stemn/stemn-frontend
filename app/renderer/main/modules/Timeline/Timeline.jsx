// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarTimelineActions from 'app/shared/actions/sidebarTimeline';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import styles from './Timeline.css';

// Sub Components
import MoreDots from './MoreDots/MoreDots.jsx';
import MoreButton from './MoreButton/MoreButton.jsx';
import TimelineInner from './TimelineInner/TimelineInner.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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
    const numberToShow = 15;

    const moreLeft  = this.props.timeline && this.props.timeline.data ? this.state.page < this.props.timeline.data.length / numberToShow - 1 : false;
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
              {this.props.timeline && this.props.timeline.data ?
                <TimelineInner
                  timeline={this.props.timeline}
                  numberToShow={numberToShow}
                  TimelineActions={this.props.TimelineActions}
                  page={this.state.page}
                  project={this.props.project} /> : '' }
            </div>
          </div>
        </div>
      </div>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ sidebarTimeline }, {project}) {
  return {
    timeline: sidebarTimeline[project._id],
    project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TimelineActions: bindActionCreators(SidebarTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
