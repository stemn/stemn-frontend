import React, { PropTypes } from 'react';
import classNames from 'classnames';
import DisplayReadme from './DisplayReadme.jsx'

const propTypesObject = {
  files: PropTypes.array,
}

export const Readme = React.createClass({
  propTypes: propTypesObject,
  render() {
    const { files, ...otherProps } = this.props
    const readmeNames = ['readme.md', 'readme.txt']
    const readme = files.find(item => readmeNames.includes(item.name.toLowerCase()))
    return readme
      ? (
        <div>
          <div style={{margin: '30px 0 15px'}} className="text-mini-caps">{readme.name}</div>
          <div { ...otherProps } style={{position: 'relative'}}>
            <DisplayReadme file={readme}/>
          </div>
        </div>
      )
      : null
  }
})

export default Readme
