// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ThreadsActions from '../Threads.actions.js'

// Component Core
import React from 'react'
import { get, has } from 'lodash'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

// Sub Components
import ThreadLabelsEdit from '../ThreadLabelsEdit/ThreadLabelsEdit.jsx'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// COMPONENT /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

export class Component extends React.Component {
  componentWillMount() {
    if (has(this.props, 'board.data.labels')) {
      this.props.dispatch(storeChange(`${this.props.boardModel}.forms.labels`, this.props.board.data.labels))
    }
  }

  submit = () => {
    this.props.dispatch(storeChange(`${this.props.boardModel}.data.labels`, this.props.board.forms.labels))
    setTimeout(() => {
      this.props.threadsActions.updateBoard({ board: this.props.board.data }).then((response) => {
        this.props.modalConfirm()
      })
    })
  };

  render() {
    const {
      boardModel,
      board,
      modalCancel,
    } = this.props

    return (
      <div style={ { width: '500px' } }>
        <div className="modal-title">Edit Labels</div>
        <div className="modal-body" style={ { maxHeight: '400px', overflowY: 'auto' } }>
          { has(board, 'forms.labels')
            ? <ThreadLabelsEdit model={ `${boardModel}.forms.labels` } value={ board.forms.labels } />
            : null}
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={ { marginRight: '10px' } } onClick={ modalCancel }>Cancel</Button>
          <Button
            className="primary"
            onClick={ this.submit }
            loading={ board.savePending }
          >Update Labels</Button>
        </div>
      </div>
    )
  }
}

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// CONTAINER /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

function mapStateToProps(state, { boardId }) {
  const boardModel = `threads.boards.${boardId}`
  return {
    board: get(state, boardModel), // Get the value from the model
    boardModel,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    threadsActions: bindActionCreators(ThreadsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
