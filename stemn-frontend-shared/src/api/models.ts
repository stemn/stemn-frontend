/**
 * Named entity types for the domains served through the client, as the API sends them (the generated
 * component schemas, with the overrides of scripts/api-client/overrides.mjs applied).
 */
import type { NotificationListResponse, ProjectGetResponse, UserMeResponse } from './operations.gen'
import type { Schemas } from './types'

export type IEntitySummary = Schemas['IEntitySummary']
export type IProject = ProjectGetResponse
export type IProjectTeamMember = IProject['team'][number]
export type IThread = Schemas['IThreadClientTransformed']
export type IComment = Schemas['IComment']
export type IReaction = Schemas['IReactionClientTransformed']
export type INotification = NotificationListResponse[number]
export type IMe = UserMeResponse
/** The `/search?type=project` rows the project lists select */
export type IProjectSummary = Pick<IProject, '_id' | 'name' | 'stub' | 'picture' | 'blurb' | 'private' | 'updated'> &
  Partial<Pick<IProject, 'clone' | 'remote'>>
