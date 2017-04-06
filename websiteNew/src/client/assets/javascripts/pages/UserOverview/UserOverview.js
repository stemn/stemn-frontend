import React, { Component, PropTypes } from 'react';

import classes from './UserOverview.css';
import classNames from 'classnames';
import { orderBy } from 'lodash';
import { Row, Col } from 'stemn-shared/misc/Layout'

import Project from 'modules/Project';
import CalendarHeatmap from 'react-calendar-heatmap';

const values = [
  { date: '2017-04-01', count: 1 },
  { date: '2017-04-03', count: 2 },
  { date: '2017-04-06', count: 3 },  
  { date: '2017-02-01', count: 4 },
  { date: '2017-02-03', count: 2 },
  { date: '2017-02-06', count: 5 },  
  { date: '2017-01-01', count: 1 },
  { date: '2017-01-04', count: 2 },
  { date: '2017-01-06', count: 5 },  
  { date: '2017-01-07', count: 4 },
  { date: '2017-01-12', count: 3 },
  { date: '2017-01-18', count: 3 },
];

export default class UserOverview extends Component {
  getColorClass = (value) => {
    if (!value) {
      return classes.s0
    }
    return classes[`s${value.count}`];
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
        <div className='text-mini-caps'>Contribution Activity</div>
        <br/>
        <div className={ classes.heatGraph }>
          <CalendarHeatmap
            numDays={280}
            gutterSize={2}
            values={ values }
            classForValue={ this.getColorClass }
          />
        </div>

      </div>
    )
  }
}
//        { user.data.profile.profileDetails.summary }
