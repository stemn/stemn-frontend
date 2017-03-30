import React, { PropTypes } from 'react';
import Header from '../../modules/Header';

const App = (props) => (
  <div>
    <Header />
    { React.cloneElement({...props}.children, {...props}) }
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
