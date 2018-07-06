// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

// Component Core
import React from 'react'

import { Link }                 from 'react-router'
import SidebarTimeline          from 'stemn-shared/misc/SyncTimeline/SidebarTimeline/SidebarTimeline.jsx'
import ContentSidebar           from 'stemn-shared/misc/ContentSidebar'
import Guide                    from 'stemn-shared/misc/Guide/Guide'
import Button                   from 'stemn-shared/misc/Buttons/Button/Button'
import timelineImg              from 'stemn-shared/assets/images/pure-vectors/timeline.svg'
import cloudProviders           from 'stemn-shared/assets/images/illustrations/cloud-providers.svg'

export class Component extends React.Component {
  // Mounting
  onMount = (nextProps, prevProps) => {
    if (nextProps.project && nextProps.project.data && nextProps.project.data.remote.connected) {
      if (!prevProps || nextProps.project.data._id !== prevProps.project.data._id) {
        nextProps.syncTimelineActions.fetchTimeline({
          types: ['commits'],
          size: 100,
          entityType: 'project',
          entityId: nextProps.project.data._id,
        })
      }
    }
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  refresh = () => {
    this.props.syncTimelineActions.fetchTimeline({
      types: ['commits'],
      size: 100,
      entityType: 'project',
      entityId: this.props.project.data._id,
    })
  };

  render() {
    const {
      timeline,
      timelineModel,
      project,
      children,
    } = this.props
    const baseLink = `project/${project && project.data ? project.data._id : ''}`

    if (project.data.remote.connected) {
      return (
        <div className="layout-column flex rel-box">
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar className="flex">
                <SidebarTimeline
                  items={ timeline && timeline.data ? timeline.data : [] }
                  loading={ timeline && timeline.loading }
                  query={ timeline && timeline.query ? timeline.query : '' }
                  queryModel={ `${timelineModel}.query` }
                  refresh={ this.refresh }
                  projectId={ project.data._id }
                />
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              { children || <div className="layout-column layout-align-center-center flex text-title-4 text-center">
                <img src={ timelineImg } style={ { width: '100px' } } />
                <div>No commit selected.</div>
              </div>
              }
            </div>
          </div>
        </div>
      )
    }
    
    const guideInfo = [{
      title: 'Cloud Storage Not Connected',
      description: 'Connect this project to your cloud storage folder so STEMN can track changes to your files.',
      image: cloudProviders,
    }]
    return (
      <div className="layout-column flex layout-align-center">
        <div className="layout-row layout-align-center"><Guide data={ guideInfo[0] } /></div>
        <div className="layout-row layout-align-center">
          <Link to={ `${baseLink}/settings` }><Button className="primary lg">Select Project Folder</Button> </Link>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ syncTimeline, projects }, { params }) {
  const project = projects.data[params.stub]
  return {
    timeline: syncTimeline[project.data._id],
    timelineModel: `syncTimeline.${project.data._id}`,
    project,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
