import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ChangesActions from 'stemn-shared/misc/Changes/Changes.actions.js'
import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import * as WalkthroughActions from 'stemn-shared/misc/Walkthrough/Walkthrough.actions.js'

import React from 'react'

import { has, some } from 'lodash'

import { Link }             from 'react-router'
import ContentSidebar       from 'stemn-shared/misc/ContentSidebar'
import LoadingOverlay       from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import CommitChanges        from 'stemn-shared/misc/Changes/CommitChanges/CommitChanges.jsx'
import CommitBox            from 'stemn-shared/misc/Changes/CommitBox/CommitBox.jsx'
import FileCompare          from 'stemn-shared/misc/FileCompare'
import Guide                from 'stemn-shared/misc/Guide/Guide'
import file                 from 'stemn-shared/assets/images/pure-vectors/file.svg'
import commitChanges        from './commit-changes.svg'
import compareFile          from './compare-file.svg'
import cloudProviders       from 'stemn-shared/assets/images/illustrations/cloud-providers.svg'
import Button               from 'stemn-shared/misc/Buttons/Button/Button'


const guideInfo = [{
  title: 'Commit changes and check-off threads',
  description: 'Package recent file changes into a \'commit\' that describes what has changed. Tag teammates and mark related threads as complete.',
  image: commitChanges,
}, {
  title: 'Review recent file changes',
  description: 'Compare your files before and after recent changes. Review changes to help you add an informative commit message for your teammates.',
  image: compareFile,
}]

const notConnectedGuide = [{
  title: 'Cloud Storage Not Connected',
  description: 'Connect this project to your cloud storage folder so STEMN can track changes to your files.',
  image: cloudProviders,
}]

// /////////////////////////////// COMPONENT /////////////////////////////////

const CommitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)',
}

export class Component extends React.Component {
  state = {
    hideGuide: false,
  };

  getStarted = () => {
    this.props.walkthroughActions.activate({ name: 'commit.commitIntro' })
    this.setState({ hideGuide: true })
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  onMount = (nextProps, prevProps) => {
    // If the project is connected to a remote
    if (has(nextProps, 'project.data.remote.connected') && nextProps.project.data.remote.connected) {
      // And the project has changed
      if (!prevProps || nextProps.project.data._id !== prevProps.project.data._id) {
        nextProps.changesActions.fetchChanges({ projectId: nextProps.project.data._id })
        nextProps.syncTimelineActions.fetchTimeline({
          types: ['commits'],
          size: 100,
          entityType: 'project',
          entityId: nextProps.project.data._id,
        })
      }
    }
  };

  refresh = () => {
    this.props.changesActions.fetchChanges({
      projectId: this.props.project.data._id,
    })
  };

  toggleAll = ({ value }) => this.props.changesActions.toggleAll({
    value,
    projectId: this.props.project.data._id,
  });

  commitFn = () => {
    this.props.changesActions.commit({
      projectId: this.props.project.data._id,
      name: this.props.changes.name,
      body: this.props.changes.body,
    })
  };

  deselect = () => {
    this.props.changesActions.deselect({
      projectId: this.props.project.data._id,
    })
  };

  render() {
    const { changes, timeline, project, changesActions, entityModel, dispatch } = this.props
    const { hideGuide } = this.state

    const hasCommits = timeline && timeline.data && timeline.data.length > 0
    const isLoading  =
          project  && project.loading  && !project.data   ||
          changes  && changes.loading  && !changes.data   ||
          timeline && timeline.loading && !timeline.data


    const projectNotConnectedTemplate = () => {
      const baseLink = `project/${project.data._id}`
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center">
            <Guide data={ notConnectedGuide[0] } />
          </div>
          <div className="layout-row layout-align-center">
            <Link to={ `${baseLink}/settings` }><Button className="primary lg">Select Project Folder</Button></Link>
          </div>
        </div>
      )
    }

    const guideTemplate = () => (
      <div className="layout-column flex layout-align-center">
        <div className="layout-row layout-align-center">
          <Guide data={ guideInfo[0] } />
          <Guide data={ guideInfo[1] } />
        </div>
        <div className="layout-row layout-align-center">
          <Button onClick={ this.getStarted } className="primary lg">Create your first commit</Button>
        </div>
      </div>
    )

    const showChangesTemplate = () => {
      const validItemIsSelected = changes ? some(changes.data, item => changes.selected && item._id == changes.selected._id) : false
      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar>
                <div className="layout-column flex">
                  {changes && changes.data
                    ? <CommitChanges
                      initialSync={ !project.data.remote.lastSynced }
                      changes={ changes }
                      project={ project.data }
                      toggleAll={ this.toggleAll }
                      selectedFileChange={ changesActions.selectedFileChange }
                      refresh={ this.refresh }
                      loading={ changes.loading }
                      deselect={ this.deselect }
                      dispatch={ dispatch }
                    />
                    : ''}
                </div>
                <div style={ CommitBoxStyles }>
                  <CommitBox
                    entityModel={ entityModel }
                    changes={ changes }
                    changesActions={ changesActions }
                    commitFn={ () => this.commitFn() }
                    project={ project.data }
                  />
                </div>
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              { validItemIsSelected
                ? <FileCompare
                  project={ project.data }
                  file={ changes.selected }
                />
                : (
                  <div className="layout-column layout-align-center-center flex text-title-4 text-center">
                    <img src={ file } style={ { width: '100px' } } />
                    <div>No file change selected</div>
                  </div>)
              }
            </div>

          </div>
        </div>
      )
    }

    const getTemplate = () => {
      if (!has(project, 'data.remote.connected') || !project.data.remote.connected) {
        return projectNotConnectedTemplate()
      } else if (!hasCommits && !hideGuide) {
        return guideTemplate()
      }
      
      return showChangesTemplate()
    }

    return (
      <div className="layout-column flex rel-box">
        <LoadingOverlay show={ isLoading } />
        {!isLoading ? getTemplate() : null}
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ changes, projects, syncTimeline }, { params }) {
  const project = projects.data[params.stub]
  return {
    project,
    changes: changes[params.stub],
    timeline: syncTimeline[params.stub],
    entityModel: `changes.${params.stub}`,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    walkthroughActions: bindActionCreators(WalkthroughActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
