import * as files from './files.js';

export default (action) => {
  switch (action.type) {
    case 'FILES/UPDATE':
      return files.update(action.payload);
    case 'FILES/DELETE':
      return files.delete(action.payload);
    default:
      return {};
  }
}
