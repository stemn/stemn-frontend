import React from 'react'
import Page from './PreviewPdfPage.jsx'

class Viewer extends React.Component {
  render() {
    const { pdf, scale } = this.props
    const numPages = pdf ? pdf.numPages : 0
    const fingerprint = pdf ? pdf.fingerprints[0] : 'none'
    const pages = Array.from({ length: numPages })
      .map((v, i) => (
        <Page
          index={ i + 1 }
          key={ `${fingerprint}-${i}` }
          pdf={ pdf }
          scale={ scale }
        />
      ))

    return (
      <div>
        {pages}
      </div>
    )
  }
}
export default Viewer
