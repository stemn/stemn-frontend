import { connect } from 'react-redux'
import SiteSearch from './SiteSearch'
import { setQuery } from 'stemn-shared/misc/Search/Search.actions'
import { push } from 'stemn-shared/routing'

const stateToProps = ({ search }) => ({
  query: search.query,
})

const dispatchToProps = {
  setQuery,
  push,
}

export default connect(stateToProps, dispatchToProps)(SiteSearch)
