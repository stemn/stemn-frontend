import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Component from './Autosuggest.jsx'
import {
  updateInputValue,
  clearSuggestions,
  loadSuggestions,
} from './Autosuggest.actions.js'


function mapStateToProps({ autosuggest }, { cacheKey, initialValue }) {
  const instance = autosuggest[cacheKey] || {}
  return {
    value: instance.value === undefined
      ? (initialValue || '')
      : instance.value,
    suggestions: instance.suggestions || [],
    isLoading: instance.isLoading || false,
  }
}

const dispatchToProps = (dispatch, { cacheKey }) => bindActionCreators({
  clearSuggestions: clearSuggestions(cacheKey),
  updateInputValue: updateInputValue(cacheKey),
  loadSuggestions: loadSuggestions(cacheKey),
}, dispatch)

export default connect(mapStateToProps, dispatchToProps)(Component)
