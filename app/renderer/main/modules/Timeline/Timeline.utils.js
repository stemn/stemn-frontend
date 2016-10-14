import { groupBy, values } from 'lodash';

export const groupRevisions = (revisions) => {
  return values(groupBy(revisions, 'data.fileId')).map(file => Object.assign({}, file[0], {revisions: file}))
}
