// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Component Core
import React from 'react'
import moment from 'moment'

// Container Actions
import * as ThreadsActions from 'stemn-shared/misc/Threads/Threads.actions.js'

// Styles
import classNames from 'classnames'
import classes from './ThreadRow.css'
import loadingClasses from 'stemn-shared/misc/Loading/LoadingPlaceholders/LoadingPlaceholders.css'


// Sub Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

// /////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  // Mounting
  onMount(nextProps, prevProps) {
    if (!prevProps || prevProps.threadId != nextProps.threadId) {
      if (!nextProps.thread || !nextProps.thread.data) {
        nextProps.dispatch(ThreadsActions.getThread({
          threadId: nextProps.threadId,
        }))
      }
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) },
  render() {
    const { thread, entityModel, toggleComplete, toggleRelated, status } = this.props

    if (!thread || !thread.data) {
      return (
        <div className={ classNames(classes.row, loadingClasses.loading, 'layout-row', 'layout-align-start-center') }>
          <div className="flex text-ellipsis">The thread namelongword goes here</div>
          <Button className={ classNames('xs', classes.button) } style={ { width: '60px' } }>&nbsp;</Button>
          <Button className={ classNames('xs', classes.button) } style={ { width: '60px' } }>&nbsp;</Button>
        </div>
      )
    }
    return (
      <div className={ `${classes.row} layout-row layout-align-start-center` }>
        <div className="flex text-ellipsis">{thread.data.name}</div>
        <Button
          className={ classNames('xs', classes.button, { [classes.active]: status === 'complete' }) }
          title="Mark as closed"
          onClick={ toggleComplete }
        >Close</Button>
        <Button
          className={ classNames('xs', classes.button, { [classes.active]: status === 'related' }) }
          title="Mark as related"
          onClick={ toggleRelated }
        >Related</Button>
      </div>
    )
  },
})

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ threads }, { threadId }) {
  return {
    thread: threads.data[threadId],
    entityModel: `threads.data[${threadId}]`,
  }
}

export default connect(mapStateToProps)(Component)
