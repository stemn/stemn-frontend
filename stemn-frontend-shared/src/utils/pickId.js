import { isObjectId } from 'stemn-shared/utils/isObjectId.js';

export const pickId = (obj) => {

  // mongoose models don't work with Object.keys, so strip the model if it exists
  const object = obj && obj.toObject
    ? obj.toObject()
    : obj;

  // mentions are a special case that use mentionId, not _id
  if (object && Object.keys(object).includes('mentionId')) {
    return object.mentionId;
  } else if (object && Object.keys(object).includes('_id')) {
    return pickId(object._id);
  } else if (isObjectId(object)) {
    return object.toString();
  } else {
    return object;
  }
};
