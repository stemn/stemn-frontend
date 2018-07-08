import { connect } from 'react-redux'
import Comment from './Comment'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import {
  deleteComment,
  finishEdit,
  getComment,
  startEdit,
  toggleReaction,
  updateComment,
} from 'stemn-shared/misc/Comments/Comments.actions.js'
import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions.js'

const stateToProps = ({ comments }, { commentId }) => ({
  comment: comments.data[commentId],
  entityModel: `comments.data.${commentId}`,
})

const dispatchToProps = {
  showConfirm,
  deleteComment,
  finishEdit,
  getComment,
  startEdit,
  toggleReaction,
  updateComment,
}

const fetchConfigs = [{
  hasChanged: 'commentId',
  onChange: (props) => {
    props.getComment({
      commentId: props.commentId,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(Comment)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
