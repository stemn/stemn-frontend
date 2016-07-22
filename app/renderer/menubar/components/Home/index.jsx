import React, { PropTypes } from 'react';
import CommitChanges from '../../../main/components/CommitChanges'
import CommitBox from '../../../main/components/CommitBox/CommitBox'

function Home(props) {
  return (
    <div className="layout-column flex">
      <div className="scroll-box flex">
        <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll} selectedFileChange={props.selectedFileChange}/>
      </div>
      <CommitBox changes={props.changes}/>
    </div>
  );
}

Home.propTypes = {
  changes: PropTypes.object.isRequired,
};

export default Home;
