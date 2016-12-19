// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './DashboardPage.css'

// Sub Components
import Header       from 'app/renderer/main/modules/Header/Header.jsx'
import DragResize   from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import Calendar     from 'app/renderer/main/modules/Calendar/Calendar.jsx';
import Tabs         from 'app/renderer/main/components/Tabs/Tabs';
import Tasks        from 'app/renderer/main/modules/Tasks/Tasks.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      date: moment(),
    }
  },
  render() {
    return (
      <div className="layout-column flex rel-box">
        <Header absolute={true}></Header>
        <div className="flex layout-row">
          <div className="flex" style={{padding: '50px'}}>
            <div className="layout-row layout-align-center">
              <Tabs size="lg">
                <Link activeClassName="active" to='/dashboard'>My Tasks</Link>
                <Link activeClassName="active" to='/feed'>Activity</Link>
              </Tabs>
            </div>
            <br />
            <br />
            <Tasks/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 600]} className="layout-column">
            <div className={classes.sidebarRight + ' layout-column flex'}>
              <div style={{marginTop: '15px'}}>
                <Calendar
                  onNextMonth={() => this.setState({ date: this.state.date.clone().add(1, 'months') }) }
                  onPrevMonth={() => this.setState({ date: this.state.date.clone().subtract(1, 'months') }) }
                  date={this.state.date}
                  onPickDate={(date) => { this.setState({date: date }) }}
                  renderDay={(day) => day.format('D')}
                />
              </div>
            </div>
          </DragResize>
        </div>
      </div>
    );
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

