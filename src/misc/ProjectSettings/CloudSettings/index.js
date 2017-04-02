import React, { Component, PropTypes } from 'react';

import { has } from 'lodash';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';
import FileSelectInput from 'stemn-shared/misc/FileSelectInput/FileSelectInput.jsx'
import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'

export default class GeneralSettings extends Component {
  static propTypes = {
    entityModel: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    confirmLinkRemote: PropTypes.func.isRequired,
  }
  render() {
    const { entityModel, project, confirmLinkRemote } = this.props;
    return (
      <div>
         <h3>Cloud Storage Folder</h3>
         <p>Select your project's cloud storage folder. STEMN will track all changes to files in this folder.</p>
         { has(project, 'formModels.fileStore.remote')
         ? <div>
             <ProjectLinkRemote model={`${entityModel}.formModels.fileStore.remote.provider`} value={project.formModels.fileStore.remote.provider}/>
             <br />
             <FileSelectInput
               projectId={project.data._id}
               provider={project.formModels.fileStore.remote.provider}
               model={`${entityModel}.formModels.fileStore.remote.root`}
               value={project.formModels.fileStore.remote.root || {}}
               disabled={!(has(project, 'formModels.fileStore.remote.provider') && ['drive', 'dropbox'].includes(project.formModels.fileStore.remote.provider))}
             />
           </div>
         : null }
         <br />
         <div className="layout-row layout-align-end">
           <ProgressButton
           className="primary"
           onClick={confirmLinkRemote}
           loading={project.linkPending}
           error={project.linkRejected}
           >Update Folder</ProgressButton>
         </div>
      </div>
    )
  }
}
