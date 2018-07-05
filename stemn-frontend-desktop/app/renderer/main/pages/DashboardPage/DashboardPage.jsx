import { connect } from 'react-redux'

// Container Actions

// Component Core
import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

import classes from './DashboardPage.css'

// Sub Components
import Header       from 'stemn-shared/misc/Header/Header.jsx'
import DragResize   from 'stemn-shared/misc/DragResize/DragResize.jsx'
import Calendar     from 'stemn-shared/misc/Calendar/Calendar.jsx'
import Tabs         from 'stemn-shared/misc/Tabs/Tabs'

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// COMPONENT /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

export class Component extends React.Component {
  state = {
    date: moment(),
  };

  render() {
    return (
      <div className="layout-column flex rel-box">
        <Header absolute />
        <div className="flex layout-row">
          <div className="flex" style={ { padding: '50px' } }>
            <div className="layout-row layout-align-center">
              <Tabs size="lg">
                <Link activeClassName="active" to="/dashboard">My Threads</Link>
                <Link activeClassName="active" to="/feed">Activity</Link>
              </Tabs>
            </div>
            <br />
            <br />
          </div>
          <DragResize side="left" width="450" widthRange={ [0, 600] } className="layout-column">
            <div className={ `${classes.sidebarRight} layout-column flex` }>
              <div style={ { marginTop: '15px' } }>
                <Calendar
                  onNextMonth={ () => this.setState({ date: this.state.date.clone().add(1, 'months') }) }
                  onPrevMonth={ () => this.setState({ date: this.state.date.clone().subtract(1, 'months') }) }
                  date={ this.state.date }
                  onPickDate={ (date) => { this.setState({ date }) } }
                  renderDay={ day => day.format('D') }
                />
              </div>
            </div>
          </DragResize>
        </div>
      </div>
    )
  }
}

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// CONTAINER /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

