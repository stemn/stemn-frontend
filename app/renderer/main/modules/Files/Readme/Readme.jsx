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
      <div>
        <div style={{margin: '30px 0 15px'}} className="text-mini-caps">{readme.name}</div>
        <div { ...omit(this.props, Object.keys(propTypesObject)) } style={{position: 'relative'}}>
          { readme
          ? <div>
              <DisplayReadme file={readme}/>
            </div>
          : null }
        </div>
      </div>
    )
  }
});

export default Readme
