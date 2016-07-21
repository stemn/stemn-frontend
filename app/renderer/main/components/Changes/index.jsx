import React, { PropTypes } from 'react';
import moment from 'moment';

function Jobs({ startJob, stopJob, removeJob, job, selectedFile }) {
  return (
    <div className="layout-column flex rel-box">
      
      <div className="layout-row flex">
        <div className="layout-column">

        </div>
        <div className="layout-column">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, rem doloribus accusantium omnis eius sequi! Expedita hic sit quia facilis culpa ad quasi, unde voluptatibus, praesentium perspiciatis deserunt. Iure, molestias.
        </div>
      </div>
    </div>
  );
}
//          <h1>{selectedFile.name}</h1>

//<Timeline />

//          <ContentSidebar>
//            <CommitChanges/>
//          </ContentSidebar>

Jobs.propTypes = {
  startJob: PropTypes.func.isRequired,
  stopJob: PropTypes.func.isRequired,
  removeJob: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired,
};

export default Jobs;
