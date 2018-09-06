import React from 'react'

// import classes from './banner.css';

export default class Guide extends React.Component {
  render() {
    const { data } = this.props
    return (
      <div style={ { padding: '30px', maxWidth: '400px', textAlign: 'center' } }>
        <img style={ { width: '80%', marginBottom: '30px' } } src={ data.image } />
        <div className="text-title-4" style={ { marginBottom: '15px' } }>{data.title}</div>
        <div className="text-title-5">{data.description}</div>
      </div>
    )
  }
}
