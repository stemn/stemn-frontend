import React, { PropTypes } from 'react';
import CommitChanges from '../../../main/components/CommitChanges'

function Home(props) {
  return (
    <div>
      <h3>{props.changes.model.selectedFile.name}</h3>
      <CommitChanges changes={props.changes} actToggleAll={props.actToggleAll} selectedFileChange={props.selectedFileChange}/>
    </div>
  );
}

Home.propTypes = {
  changes: PropTypes.object.isRequired,
};

export default Home;
