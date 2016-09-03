import * as ChangesActions from 'app/shared/actions/changes.js';

export const updateGoober = (payload) =>{
  // Return a redux event
  return ChangesActions.fetchChanges({
    projectId: payload.projectId
  })
}
