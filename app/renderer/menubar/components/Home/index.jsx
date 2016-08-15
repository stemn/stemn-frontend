import React, { PropTypes } from 'react';
import CommitChanges from 'app/renderer/menubar/components/CommitChanges'
import CommitBox from 'app/renderer/menubar/components/CommitBox/CommitBox'
import Toolbar from 'app/renderer/menubar/containers/Toolbar'
import Sidebar from 'app/renderer/menubar/containers/Sidebar'

const commitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)',
  marginTop: '-1px'
}
function Home(props) {
  return (
    <div className="layout-column flex">
      <Toolbar>Project Spartan Spear</Toolbar>
      <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll}/>
      <div style={commitBoxStyles}>
        <CommitBox changes={props.changes}/>
      </div>
      <Sidebar />
    </div>
  );
}

Home.propTypes = {
  changes: PropTypes.object.isRequired,
};

export default Home;
