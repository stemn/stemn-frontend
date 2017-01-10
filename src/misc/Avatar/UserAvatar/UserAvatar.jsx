import React from 'react';
import classNames from 'classnames'

const colours = [
  '#D50000','#FF4081','#CE93D8','#AA00FF','#B39DDB','#6200EA','#3F51B5','#1A237E','#2962FF','#0091EA','#00B8D4','#00BFA5',
  '#A5D6A7','#00C853','#64DD17','#E6EE9C','#AEEA00','#FFD600','#FFAB00','#FF6D00','#FFAB91','#DD2600','#455A64','#263238'
];

export default React.createClass({
  default: '/assets/images/default/user-1.png',
  render() {
    const { style, shape, size, className, picture, title, name } = this.props;
    const styles = {
      borderRadius : shape == 'square' ? '3px' : '50%',
      width        : size+'px' || '30px',
      height       : size+'px' || '30px'
    };
    const actualStyles = Object.assign({}, style, styles);

    if(picture){
      return (
        <img className={className}
          title={title}
          style={actualStyles}
          src={`${GLOBAL_ENV.API_SERVER}${picture || this.default}?size=thumb&crop=true`}
        />
      );
    }
    else{
      let initials, colourIndex;
      if(name){
        const firstLetterNumber = name.toLowerCase().charCodeAt(0) - 97;
        const firstLetterNumberNormalised = firstLetterNumber < 24 && firstLetterNumber >= 0 ? firstLetterNumber : 5; // Make sure it is between 0 and 24
        const nameSplit = name.split(' ');
        initials = nameSplit[0] && nameSplit[1] ? nameSplit[0][0] + nameSplit[1][0] : nameSplit[0][0];
        colourIndex = Math.floor(firstLetterNumberNormalised * colours.length / 24);
      }

      const colorStyles = {
        background: name ? colours[colourIndex] : '#eaeaea',
        color: 'white',
        fontSize: size > 25 ? '14px' : '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }

      return (
        <div className={classNames(className, 'layout-column layout-align-center-center')} title={title} style={Object.assign({}, actualStyles, colorStyles)}>
          {name ? initials : ''}
        </div>
      )
    }
  }
})
