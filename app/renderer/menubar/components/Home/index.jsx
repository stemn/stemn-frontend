import React, { PropTypes } from 'react';
import CommitChanges from '../../../main/components/CommitChanges'
import CommitBox from '../../../main/components/CommitBox/CommitBox'

const commitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)',
}
function Home(props) {
  return (
    <div className="layout-column flex">
      <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll} selectedFileChange={props.selectedFileChange}/>
      <div style={commitBoxStyles}>
        <CommitBox changes={props.changes}/>
      </div>
    </div>
  );
}

Home.propTypes = {
  changes: PropTypes.object.isRequired,
};

export default Home;
