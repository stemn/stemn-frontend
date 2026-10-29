import React, { Component } from 'react'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

export default class Highlight extends Component {
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
      <span {...otherProps}>
        {parts.map((part, index) => {
          const className = part.highlight ? hightlightClass : null
          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          )
        })}
      </span>
    )
  }
}
