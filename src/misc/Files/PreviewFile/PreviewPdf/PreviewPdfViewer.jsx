import React from 'react'
import Page from './PreviewPdfPage.jsx'

class Viewer extends React.Component {
  render() {
    const { pdf, scale } = this.props
    const numPages = pdf ? pdf.pdfInfo.numPages : 0
    const fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none'
    const pages = Array(...{ length: numPages })
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
