import React from 'react'

export default class PreviewGdoc extends React.Component {
  render() {
    const { fileMeta } = this.props
    return (
      <div className="flex rel-box layout-column">
        <iframe className="flex" src={ fileMeta.url } style={ { border: 'none' } } />
      </div>
    )
  }
}
