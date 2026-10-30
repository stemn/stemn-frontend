/**
 * Projects: get one, list a user's projects, update.
 *
 * Coexistence: the project page containers that are not migrated yet (overview, files, settings
 * tabs, pipelines...) read `projects.data[id]` and `projects.userProjects[userId]`. These queries
 * keep both up to date through legacySync, and legacy writes (desktop, settings forms still on Redux
 * actions) invalidate them (`projectLegacyInvalidations`).
 */
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, unwrap } from '../client'
import type { ProjectUpdateBody } from '../operations.gen'
import type { IProject, IProjectSummary } from '../models'
import type { LegacyInvalidations } from '../query/invalidation'
import { queryKeys } from '../query/keys'
import { legacySync } from '../query/meta'

const userProjectFields = ['_id', 'picture', 'stub', 'name', 'type', 'remote', 'updated', 'blurb', 'private', 'clone']

export const projectQueries = {
  detail: (projectId: string) =>
    queryOptions({
      queryKey: queryKeys.projects.detail(projectId),
      queryFn: ({ signal }) =>
        unwrap(api.GET('/api/v1/projects/{projectId}', { params: { path: { projectId } }, signal })),
      meta: {
        legacySync: legacySync<IProject>((project) => ({
          type: 'PROJECTS/GET_PROJECT_FULFILLED',
          payload: { data: project },
          meta: { projectId, size: 'lg' },
        })),
      },
    }),
  /** A user's projects (`includePrivate` when it is the current user), newest first */
  byUser: (userId: string, includePrivate: boolean) =>
    queryOptions({
      queryKey: queryKeys.projects.byUser(userId, includePrivate),
      queryFn: async ({ signal }) => {
        const results = await unwrap(
          api.GET('/api/v1/search', {
            params: {
              query: {
                type: 'project',
                parentType: 'user',
                parentId: userId,
                size: 1000,
                published: 'both',
                select: userProjectFields,
                criteria: { private: includePrivate ? 'all' : false },
              },
            },
            signal,
          }),
        )
        return results as IProjectSummary[] // the search route is untyped (`unknown[]`): rows of the selected fields
      },
      meta: {
        legacySync: legacySync<IProjectSummary[]>((projects) => ({
          type: 'PROJECTS/GET_USER_PROJECTS_FULFILLED',
          payload: { data: projects },
          meta: { userId },
        })),
      },
    }),
}

export const useProject = (projectId: string | undefined) =>
  useQuery({ ...projectQueries.detail(projectId || ''), enabled: Boolean(projectId) })

export const useUserProjects = (userId: string | undefined, currentUserId: string | undefined) =>
  useQuery({
    ...projectQueries.byUser(userId || '', Boolean(userId) && userId === currentUserId),
    enabled: Boolean(userId),
  })

/** PUT /projects/:id with the whole project; refetches it (the response is not populated) and the lists */
export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['projects', 'update'],
    mutationFn: (project: ProjectUpdateBody & { _id: string }) =>
      unwrap(api.PUT('/api/v1/projects/{projectId}', { params: { path: { projectId: project._id } }, body: project })),
    onSuccess: (_updated, project) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(project._id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.userLists() }),
      ]),
  })
}

/**
 * `saveProject({ project })` (the legacy action's signature) over useUpdateProject, for the settings
 * forms that still edit the project in Redux (`projects.data[id]`, model-bound inputs) and save it.
 */
export const useSaveProject = () => {
  const { mutateAsync, isPending } = useUpdateProject()
  return {
    // The failure is toasted by the mutation cache
    saveProject: ({ project }: { project: ProjectUpdateBody & { _id: string } }) =>
      mutateAsync(project).catch(() => undefined),
    savePending: isPending,
  }
}

const metaString = (action: { meta?: Record<string, unknown> }, key: string) => {
  const value = action.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

/** Legacy Redux writes that make project queries stale */
export const projectLegacyInvalidations: LegacyInvalidations = {
  'PROJECTS/SAVE_PROJECT_FULFILLED': (action) => {
    const projectId = metaString(action, 'projectId')
    return projectId ? [queryKeys.projects.detail(projectId), queryKeys.projects.userLists()] : []
  },
  'PROJECTS/LINK_REMOTE_FULFILLED': (action) => {
    const projectId = metaString(action, 'cacheKey')
    return projectId ? [queryKeys.projects.detail(projectId), queryKeys.projects.userLists()] : []
  },
  'PROJECTS/UNLINK_REMOTE_FULFILLED': (action) => {
    const projectId = metaString(action, 'cacheKey')
    return projectId ? [queryKeys.projects.detail(projectId), queryKeys.projects.userLists()] : []
  },
  'PROJECTS/CREATE_PROJECT_FULFILLED': () => [queryKeys.projects.userLists()],
  'PROJECTS/CLONE_FULFILLED': () => [queryKeys.projects.userLists()],
  'PROJECTS/DELETE_PROJECT_FULFILLED': () => [queryKeys.projects.userLists()],
}
