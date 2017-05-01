import React, { Component, PropTypes } from 'react';

import classes from './UserOverview.css';
import classNames from 'classnames';
import { orderBy } from 'lodash';
import { Row, Col } from 'stemn-shared/misc/Layout'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical';
import ProjectRow from 'stemn-shared/misc/Projects/ProjectRow'
import CalendarHeatmap from 'react-calendar-heatmap';

const normaliseValue = (value) => {
  if ( value === 0) {
    return 0
  } else if ( value === 1 ) {
    return 1
  } else if ( value <= 3 ) {
    return 2
  } else if ( value <= 5 ) {
    return 3
  } else if ( value <= 10 ) {
    return 4
  } else {
    return 5
  }
};

export default class UserOverview extends Component {
  getColorClass = (value) => {
    if (!value) {
      return classes.s0
    }
    return classes[`s${normaliseValue(value.count)}`];
  }
  render() {
    const { user, projects } = this.props;
    
    const projectsToDisplay = orderBy(projects.data,'updated', 'desc').slice(0, 4);
    return (
      <div>
        <div className='text-mini-caps'>Recent Projects</div>
        <br/>
        <Row className='sm layout-row layout-wrap'>
          { projectsToDisplay.map(project => (
            <Col key={ project._id } className='sm flex-100 flex-gt-sm-50'>
              <ProjectRow
                key={ project._id } 
                projectId={ project._id } 
                className={ classes.project }
              />
            </Col>
          ))}
        </Row>
        <br/>
        <div className='text-mini-caps'>Contribution History</div>
        <br/>
        <div className={ classes.panel }>
          <CalendarHeatmap
            numDays={280}
            gutterSize={2}
            values={ user.commitHistory && user.commitHistory.data ? user.commitHistory.data : [] }
            classForValue={ this.getColorClass }
          />
        </div>
        <br/>
        <div className='text-mini-caps'>About</div>
        <br />
        <InfoPanel>
          <p className={ classes.summary }>{ user.data.profile.profileDetails.summary }</p>
        </InfoPanel>
        <br />
        <div className='text-mini-caps'>Timeline</div>
        <br />
        <InfoPanel>
          <TimelineVertical
            group
            items={ [] }
            type="user"
          />
        </InfoPanel>      
        <br />
      </div>
    )
  }
}

//        <br/>
//        <div className='text-mini-caps'>Contribution Activity</div>
//        <br/>
//        <div className={ classes.panel }>
//          The contribution timeline will go here. Similar to the tasks page...
//        </div>
