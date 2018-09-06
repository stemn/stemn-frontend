import React from 'react'
import { getDownloadUrl } from '../../utils'

export default class PreviewGoogle extends React.Component {
  render() {
    const { fileMeta } = this.props
    return (
      <div className="flex rel-box layout-column">
        <iframe className="flex" src={ `https://docs.google.com/gview?url=${getDownloadUrl(fileMeta)}&embedded=true` } style={ { border: 'none' } } />
      </div>
    )
  }
}
