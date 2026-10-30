import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useProject } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import Project from './Project'
import { notFound } from 'route-actions'
import { replace } from 'stemn-shared/routing'

/**
 * The project layout (header, tabs) of every /project/:stub page. The project is the TanStack Query
 * `projects.detail` query; its legacy bridge keeps `projects.data[id]` in sync for the tab pages that
 * still read Redux. The page joins the project room: PROJECT/PROJECT_UPDATED invalidates the query.
 */
const ProjectContainer = (props) => {
  const { params, location } = props
  const projectId = params.stub
  const dispatch = useDispatch()
  const query = useProject(projectId)

  useEffect(() => {
    if (query.isError) dispatch(replace(notFound()))
  }, [dispatch, query.isError])

  useEffect(() => {
    dispatch(joinRoom({ room: projectId, type: 'project' }))
    return () => dispatch(leaveRoom({ room: projectId, type: 'project' }))
  }, [dispatch, projectId])

  return <Project {...props} projectId={projectId} project={toLegacyEntity(query)} pathname={location.pathname} />
}

export default ProjectContainer
