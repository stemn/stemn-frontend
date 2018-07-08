import { connect } from 'react-redux'
import CommentBody from './CommentBody'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getComment } from 'stemn-shared/misc/Comments/Comments.actions.js'

const stateToProps = ({ comments }, { commentId }) => ({
  comment: comments.data[commentId],
  entityModel: `comments.data.${commentId}`,
})

const dispatchToProps = {
  getComment,
}

const fetchConfigs = [{
  hasChanged: 'commentId',
  onChange: (props) => {
    props.getComment({
      commentId: props.commentId,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(CommentBody)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
