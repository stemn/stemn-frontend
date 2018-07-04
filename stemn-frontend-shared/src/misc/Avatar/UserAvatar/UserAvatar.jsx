import React from 'react'
import cn from 'classnames'
import classes from './UserAvatar.css'

const colours = [
  '#D50000', '#FF4081', '#CE93D8', '#AA00FF', '#B39DDB', '#6200EA', '#3F51B5', '#1A237E', '#2962FF', '#0091EA', '#00B8D4', '#00BFA5',
  '#A5D6A7', '#00C853', '#64DD17', '#E6EE9C', '#AEEA00', '#FFD600', '#FFAB00', '#FF6D00', '#FFAB91', '#DD2600', '#455A64', '#263238',
]

export default class UserAvatar extends React.Component {
  render() {
    // display: 'contain' (Default: 'cover')
    const { style, shape, size, className, picture, title, name, display } = this.props
    const styles = {
      borderRadius: shape === 'square' ? '3px' : '50%',
      width: `${size}px` || '30px',
      height: `${size}px` || '30px',
      minHeight: `${size}px` || '30px',
      minWidth: `${size}px` || '30px',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    }
    const actualStyles = Object.assign({}, style, styles)
    
    const resizeType = size && size > 50
      ? 'thumb-lg'
      : 'thumb'

    if (picture) {
      const pictureIsExternal = picture.startsWith('http')
      const pictureUrl = pictureIsExternal
        ? picture
        : `${GLOBAL_ENV.API_SERVER}${picture}?size=${resizeType}&crop=${display === 'contain' ? 'false' : 'true'}`
      const pictureStyles = { 
        backgroundImage: `url(${pictureUrl})`,
      }
      return (
        <div
          className={ cn(display === 'cover' ? classes.cover : classes.contain, className) }
          title={ title }
          style={ Object.assign({}, actualStyles, pictureStyles) }
        />
      )
    }
    
    let initials, 
      colourIndex
    if (name) {
      const firstLetterNumber = name.toLowerCase().charCodeAt(0) - 97
      const firstLetterNumberNormalised = firstLetterNumber < 24 && firstLetterNumber >= 0 ? firstLetterNumber : 5 // Make sure it is between 0 and 24
      const nameSplit = name.split(' ')
      initials = nameSplit[0] && nameSplit[1] ? nameSplit[0][0] + nameSplit[1][0] : nameSplit[0][0]
      colourIndex = Math.floor(firstLetterNumberNormalised * colours.length / 24)
    }

    const colorStyles = {
      background: name ? colours[colourIndex] : '#eaeaea',
      color: 'white',
      fontSize: size && size > 40 ? `${size * 0.6}px` : '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }

    return (
      <div className={ cn(className, 'layout-column layout-align-center-center') } title={ title } style={ Object.assign({}, actualStyles, colorStyles) }>
        {name ? initials : ''}
      </div>
    )
  }
}
