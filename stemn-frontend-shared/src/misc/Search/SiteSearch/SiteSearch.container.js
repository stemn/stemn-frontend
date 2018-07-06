import { connect } from 'react-redux'
import SiteSearch from './SiteSearch'
import { setQuery } from 'stemn-shared/misc/Search/Search.actions'
import { push } from 'react-router-redux'

const stateToProps = ({ search }) => ({
  query: search.query,
})

const dispatchToProps = {
  setQuery,
  push,
}

export default connect(stateToProps, dispatchToProps)(SiteSearch)
