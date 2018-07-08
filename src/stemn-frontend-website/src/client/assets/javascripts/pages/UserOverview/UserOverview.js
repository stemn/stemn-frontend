import React, { Component } from 'react'
import classes from './UserOverview.css'
import { orderBy, values, sum } from 'lodash'
import { Row, Col } from 'stemn-shared/misc/Layout'
import Panel from 'stemn-shared/misc/Panels/Panel'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import ProjectRow from 'stemn-shared/misc/Projects/ProjectRow'
import CalendarHeatmap from 'react-calendar-heatmap'
import Pagination from 'stemn-shared/misc/Pagination'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import moment from 'moment'

const normaliseValue = (value) => {
  if (value === 0) {
    return 0
  } else if (value === 1) {
    return 1
  } else if (value <= 3) {
    return 2
  } else if (value <= 5) {
    return 3
  } else if (value <= 10) {
    return 4
  } 
  return 5
}

const startDate = moment().subtract(0.8, 'year').toDate()
const endDate = moment().toDate()

export default class UserOverview extends Component {
  getColorClass = (value) => {
    if (!value) {
      return classes.s0
    }
    return classes[`s${normaliseValue(value.count)}`]
  }
  render() {
    const {
      projects,
      timeline,
      history,
      location,
      page,
      size,
    } = this.props
    const noMoreResults =  timeline && timeline.data && timeline.data.length < size

    const heatMapData = history && history.data
      ? history.data.map(item => ({
        date: item.date,
        count: sum(values(item.counts)),
      }))
      : []

    const projectsToDisplay = orderBy(projects.data, 'updated', 'desc').slice(0, 4)
    return (
      <div>
        <div className="text-mini-caps">Recent Projects</div>
        <br />
        <Row className="sm layout-row layout-wrap">
          { projectsToDisplay.map(project => (
            <Col key={ project._id } className="sm flex-100 flex-gt-sm-50">
              <ProjectRow
                key={ project._id } 
                projectId={ project._id } 
                className={ classes.project }
              />
            </Col>
          ))}
        </Row>
        <br />
        <div className="text-mini-caps">Contribution History</div>
        <br />
        <div className={ classes.panel }>
          <CalendarHeatmap
            startDate={ startDate }
            endDate={ endDate }
            gutterSize={ 2 }
            values={ heatMapData }
            classForValue={ this.getColorClass }
          />
        </div>
        <br />
        <br />
        <div className="text-mini-caps">Timeline</div>
        <br />
        <Panel>
          <LoadingOverlay show={ timeline.loading } linear hideBg noOverlay />
          { timeline.data &&
            <TimelineVertical
              group
              items={ timeline.data }
              type="user"
            />
          }
        </Panel>
        <Pagination
          path={ location.pathname }
          page={ page }
          noMoreResults={ noMoreResults }
        />
        <br />
        <br />
      </div>
    )
  }
}

//        <br/>
//        <div className='text-mini-caps'>Contribution Activity</div>
//        <br/>
//        <div className={ classes.panel }>
//          The contribution timeline will go here. Similar to the threads page...
//        </div>
