// Component Core
import React, { PropTypes } from 'react';
import { omit } from 'lodash';

// Styles
import classNames from 'classnames';

// Sub Components
import DisplayReadme from './DisplayReadme.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  files        : PropTypes.array,
};

export const Readme = React.createClass({
  propTypes: propTypesObject,
  render() {
    const { files } = this.props;
    const readmeNames = ['readme.md', 'readme.txt'];
    const readme = files.find(item => readmeNames.includes(item.name.toLowerCase()));
    return (
      <div { ...omit(this.props, Object.keys(propTypesObject)) } style={{position: 'relative'}}>
        { readme
        ? <DisplayReadme file={readme}/>
        : null }
      </div>
    )
  }
});

export default Readme
