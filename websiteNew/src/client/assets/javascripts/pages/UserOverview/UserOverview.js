import React, { Component, PropTypes } from 'react';

import classes from './UserOverview.css';
import classNames from 'classnames';
import { orderBy } from 'lodash';
import { Row, Col } from 'stemn-shared/misc/Layout'

import Project from 'modules/Project';
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
            <Col key={ project._id } className='sm flex-50'>
              <Project 
                key={ project._id } 
                project={ project } 
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
        <br/>
        <div className='text-mini-caps'>Contribution Activity</div>
        <br/>
        <div className={ classes.panel }>
          The contribution timeline will go here. Similar to the tasks page...
        </div>

      </div>
    )
  }
}
//        { user.data.profile.profileDetails.summary }
