import React, { Component, PropTypes } from 'react'
import Tag from 'stemn-shared/misc/Tags/Tag'
import Link from 'stemn-shared/misc/Router/Link'

export default class RelatedList extends Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    limit: PropTypes.number,
    related: PropTypes.object,
  }
  static defaultProps = {
    limit: 100,
  }
  render() {
    const { related, limit } = this.props

    if (related && related.data) {
      return (
        <div>
          { related.data.slice(0, limit).map((field) => (
            <Link key={ field._id } name="fieldRoute" params={{ fieldId: field.stub }}>
              <Tag className="primary" text={ field.name } style={ { marginBottom: '6px' } }/>
            </Link>
          ))}

        </div>
      )
    } else {
      return null
    }
  }
}
