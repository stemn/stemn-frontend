import React, { Component } from 'react'
import PropTypes from 'prop-types'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

export default class Highlight extends Component {
  static propTypes = {
    // The text to highlight
    text: PropTypes.string.isRequired,
    // The query
    query: PropTypes.string.isRequired,
    // The class to be applied to the highlighted section
    hightlightClass: PropTypes.string.isRequired,
  }
  static defaultProps = {
    text: '',
    query: '',
    hightlightClass: 'bold',
  }
  
  render() {
    const { text, query, hightlightClass, ...otherProps } = this.props
    const matches = match(text, query)
    const parts = parse(text, matches)
    
    return (
      <span { ...otherProps }>
        { parts.map((part, index) => {
          const className = part.highlight ? hightlightClass : null
          return (
            <span className={ className } key={ index }>{part.text}</span>
          )
        })
        }
      </span>
    )
  }
}
