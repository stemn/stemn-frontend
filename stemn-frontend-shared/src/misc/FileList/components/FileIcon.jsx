import React from 'react'
const fileTypeIcons = require.context('../filetype', true)

export default class FileIcon extends React.Component {
  static defaultProps = {
    size: 30,
  };

  render() {
    let fileType
    let isOther = false
    if (this.props.type === 'file') {
      if (this.props.fileType) {
        fileType = this.props.fileType.toLowerCase()
      } else {
        isOther = true
        fileType = 'other'
      }
    } else {
      fileType = 'folder'
    }

    let src
    try {
      src = fileTypeIcons(`./${fileType}.svg`)
    } catch (err) {
      isOther = true
      src = fileTypeIcons('./other.svg')
    }


    const imgStyle = {
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
    }
    const textStyle = {
      position: 'absolute',
      left: '50%',
      bottom: fileType.length < 4 ? '21%' : '24%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: this.props.size * (fileType.length < 4 ? 0.24 : 0.14),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: '1em',
    }


    return (
      <div className="rel-box" style={ { marginRight: '10px' } }>
        <img style={ imgStyle } src={ src } />
        {isOther ? <span style={ textStyle }>{fileType}</span> : null}
      </div>
    )
  }
}
