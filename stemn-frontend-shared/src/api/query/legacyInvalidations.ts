/** Every domain's legacy-write -> query invalidation map, for createQueryMiddleware */
import { projectLegacyInvalidations } from '../queries/projects'
import { threadLegacyInvalidations } from '../queries/threads'
import { queryKeys } from './keys'
import type { LegacyInvalidations } from './invalidation'

export const legacyInvalidations: LegacyInvalidations = {
  ...projectLegacyInvalidations,
  ...threadLegacyInvalidations,
  // The user settings page (Redux) saves the current user
  'AUTH/UPDATE_USER': () => [queryKeys.me],
}
