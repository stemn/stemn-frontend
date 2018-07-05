import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import ThreadLabelsEdit from 'stemn-shared/misc/Threads/ThreadLabelsEdit/ThreadLabelsEdit.jsx'
import ThreadGroupsEdit from 'stemn-shared/misc/Threads/ThreadGroupsEdit'
import Form from 'stemn-shared/misc/Forms/Form'
import { has } from 'lodash'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class ThreadsSettings extends Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    boardModel: PropTypes.string.isRequired,
    updateBoard: PropTypes.func.isRequired,
  }
  updateBoard = () => {
    const {
      board,
      updateBoard,
    } = this.props

    // Get the new board data
    // We filter out the empty threads and groups
    const newBoard = {
      ...board.data,
      groups: board.forms.groups.filter(item => item.name.length > 0 || item.threads.length > 0),
      labels: board.forms.labels.filter(item => item.name.length > 0 || item.color.length > 0),
    }
    updateBoard({
      board: newBoard,
    })
  }
  render() {
    const { boardModel, board } = this.props
    if (board && board.data) {
      return (
        <div>
          <InfoPanel>
            <h3>Thread Groups</h3>
            <p>Groups are used to categorize your threads. A thread can only be part of 1 group at any given time. If you delete a group, all child threads will be removed.</p>
            <Form model={ `${boardModel}.forms.groups` } value={ board.data.groups }>
              { has(board, 'forms.groups') && <ThreadGroupsEdit model={ `${boardModel}.forms.groups` } value={ board.forms.groups } /> }
            </Form>
          </InfoPanel>
          <InfoPanel>
            <h3>Thread Labels</h3>
            <p>Labels act in a similar way to Groups except a thread can have multiple labels. If you delete a label, it will be removed from all related threads.</p>
            <Form model={ `${boardModel}.forms.labels` } value={ board.data.labels }>
              { has(board, 'forms.labels') && <ThreadLabelsEdit model={ `${boardModel}.forms.labels` } value={ board.forms.labels } /> }
            </Form>
          </InfoPanel>
          <div className="layout-row">
            <div className="flex" />
            <ProgressButton
              className="primary"
              onClick={ this.updateBoard }
              loading={ board.savePending }
            >
              Save
            </ProgressButton>
          </div>
        </div>
      )
    } 
    return null
  }
}
