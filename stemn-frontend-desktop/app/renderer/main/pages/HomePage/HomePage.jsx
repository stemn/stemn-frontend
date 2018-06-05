import React from 'react'

// Components
import Header from 'stemn-shared/misc/Header/Header.jsx'
import book   from 'stemn-shared/assets/images/pure-vectors/book.svg'

// Styles
import classNames from 'classnames'


export default class extends React.Component {
  render() {
    return (
      <div className="layout-column flex rel-box">
        <Header />
        <div className="flex layout-column layout-align-center-center">
          <img src={ book } />
          <div className="text-title-2" style={ { marginTop: '20px' } }>No Project Selected</div>
        </div>
      </div>
    )
  }
}
