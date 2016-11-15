import { groupBy, values, sortBy } from 'lodash';

export const groupRevisions = (revisions) => {
  // Group revisions by FileId
//  return values(groupBy(revisions, 'data.fileId')).map(file => Object.assign({}, file[0], {revisions: file}))
  const grouped = values(groupBy(revisions, 'data.fileId')).map(file => Object.assign({}, file[0], {revisions: file}));
  return sortBy(grouped, [(item) => item.data.path.split('/').length == 1 ? 1 : 2, 'data.path'])
}
