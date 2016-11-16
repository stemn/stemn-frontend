import React from 'react';
import Page from './PreviewPdfPage.jsx'
import classes from './PreviewPdf.css';

class Viewer extends React.Component {
  render () {
    const { pdf, scale } = this.props
    const numPages = pdf ? pdf.pdfInfo.numPages : 0
    const fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none'
    const pages = Array.apply(null, { length: numPages })
      .map((v, i) => (
        <Page
          index={i + 1}
          key={`${fingerprint}-${i}`}
          pdf={pdf}
          scale={scale}
        />
      ))

    return (
      <div className={classes.viewer}>
        {pages}
      </div>
    )
  }
}
export default Viewer
