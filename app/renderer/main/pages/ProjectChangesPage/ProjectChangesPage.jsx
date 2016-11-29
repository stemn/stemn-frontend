// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'app/renderer/main/modules/Changes/Changes.actions.js';

// Component Core
import React from 'react';

import i from 'icepick';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';

// Sub Components
import { Link }             from 'react-router';
import ContentSidebar       from 'app/renderer/main/components/ContentSidebar';
import LoadingOverlay       from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Timeline             from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import CommitChanges        from 'app/renderer/main/modules/Changes/CommitChanges/CommitChanges.jsx';
import CommitBox            from 'app/renderer/main/modules/Changes/CommitBox/CommitBox.jsx'
import FileCompareStandard  from 'app/renderer/main/modules/FileCompare/FileCompareStandard/FileCompareStandard.jsx';
import Guide                from 'app/renderer/main/modules/Guide/Guide';
import cloudLocked          from 'app/renderer/assets/images/pure-vectors/cloud-locked.svg';
import file                 from 'app/renderer/assets/images/pure-vectors/file.svg';
import commitChanges        from './commit-changes.svg'
import compareFile          from './compare-file.svg'
import cloudProviders       from 'app/renderer/assets/images/illustrations/cloud-providers.svg'
import Button               from 'app/renderer/main/components/Buttons/Button/Button'


const guideInfo = [{
  title: 'Commit changes and check off tasks',
  description: 'Package recent file changes into a \'commit\' that describes what has changed. Tag teammates and mark related tasks as complete.',
  image: commitChanges,
},{
  title: 'Review recent file changes',
  description: 'Compare your files before and after recent changes. Review changes to help you add an informative commit message for your teammates.',
  image: compareFile,
}]

const notConnectedGuide = [{
  title: 'Cloud Storage Not Connected',
  description: 'Connect this project to your cloud storage folder so STEMN can track changes to your files.',
  image: cloudProviders,
}]

///////////////////////////////// COMPONENT /////////////////////////////////

const CommitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)'
};

export const Component = React.createClass({
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the project is connected to a remote
    if(has(nextProps, 'project.data.remote.connected') && nextProps.project.data.remote.connected){
      // And the project has changed
      if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
        this.props.changesActions.fetchChanges({
          projectId: nextProps.project.data._id
        })
      }
    }
  },
  refresh(){
    this.props.changesActions.fetchChanges({
      projectId: this.props.project.data._id
    })
  },
  toggleAll({value}){
    return this.props.changesActions.toggleAll({
      value,
      projectId: this.props.project.data._id
    })
  },
  commitFn(){
    this.props.changesActions.commit({
      projectId: this.props.project.data._id,
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },
  deselect(){
    this.props.changesActions.deselect({
      projectId: this.props.project.data._id
    })
  },
  render() {
    const { changes, project, changesActions, entityModel, dispatch } = this.props;

    const projectNotConnectedTemplate = () => {
      const baseLink = `project/${project.data._id}`;
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={notConnectedGuide[0]}/>
          </div>
          <div className="layout-row layout-align-center">
            <Link to={`${baseLink}/settings`}><Button className="primary lg">Select Project Folder</Button></Link>
          </div>
        </div>
      )
    }

    const guideTemplate = () => {
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={guideInfo[0]}/>
            <Guide data={guideInfo[1]}/>
          </div>
          <div className="layout-row layout-align-center">
            <Button className="primary lg">Create your first commit</Button>
          </div>
        </div>
      )
    }

    const showChangesTemplate = () => {
      const filePrevious = has(changes, 'selected.data.previousRevisionId') && changes.selected.data.previousRevisionId != null
        ? i.assocIn(changes.selected.data, ['revisionId'], changes.selected.data.previousRevisionId)
        : null;

      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar>
                <div className="layout-column flex">
                  {changes && changes.data
                  ? <CommitChanges
                      changes={changes}
                      project={project.data}
                      toggleAll={this.toggleAll}
                      selectedFileChange={changesActions.selectedFileChange}
                      refresh={this.refresh}
                      loading={changes.loading}
                      deselect={this.deselect}
                      dispatch={dispatch}
                    />
                  : ''}
                </div>
                <div style={CommitBoxStyles}>
                  <CommitBox
                    entityModel={entityModel}
                    changes={changes}
                    changesActions={changesActions}
                    commitFn={()=>this.commitFn()}
                    project={project.data}
                  />
                </div>
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {changes.selected && changes.selected.data
                ?
                <FileCompareStandard
                  compareId={`changes-${project.data._id}-${changes.selected._id}`}
                  project={project.data}
                  file1={changes.selected.data}
                  file2={filePrevious} />
                : (
                <div className="layout-column layout-align-center-center flex text-title-4 text-center">
                  <img src={file} style={{width: '100px'}}/>
                  <div>No file change selected.</div>
                </div>)
              }
            </div>

          </div>
        </div>
      );
    }

    const isLoading = project && project.loading || changes && changes.loading;
    const getTemplate = () => {
      if(isLoading){
        return null
      }
      if(!project.data.remote.connected){
        return projectNotConnectedTemplate();
      }
      else if(!changes.loading && changes.data.length == 0){
        return guideTemplate();
      }
      else{
        return showChangesTemplate();
      }
    }


    return (
      <div className="layout-column flex rel-box">
        <LoadingOverlay show={isLoading} />
        {getTemplate()}
      </div>
    )
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({changes, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    project: project,
    changes: changes[params.stub],
    entityModel: `changes.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
