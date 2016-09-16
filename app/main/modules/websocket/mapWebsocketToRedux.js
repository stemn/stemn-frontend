import * as ChangesActions from '../../../renderer/main/modules/changes.actions.js';
import * as FilesActions from '../../../shared/actions/files.js';

export default (action) => {
  switch (action.type) {
    case 'CHANGES/FETCH_CHANGES':
      return ChangesActions.fetchChanges({ projectId : action.payload.projectId });
    case 'FILES/UPDATE':
      return files.update(action.payload);
    case 'FILES/DELETE':
      return files.delete(action.payload);
    default:
      return {};
  }
}
