import React from 'react'

import file from 'stemn-shared/assets/images/pure-vectors/file.svg'

export class FileEmpty extends React.Component {
  render() {
    return (
      <div className="layout-column layout-align-center-center flex text-center">
        <div style={ { maxWidth: '300px' } }>
          <img style={ { width: '100px' } } src={ file } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>File could not be found</div>
          <div className="text-title-5">Typically, this means it has been deleted.</div>
        </div>
      </div>
    )
  }
}

export default FileEmpty
