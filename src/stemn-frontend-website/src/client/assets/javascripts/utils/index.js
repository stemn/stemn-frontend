export const isObjectId = objectId => /^[a-f0-9]{24}$/.test(objectId)

export const pickId = (object) => {
  if (object && object._id) {
    return pickId(object._id)
  } else if (isObjectId(object)) {
    return object.toString()
  }
}

export * from './typescripts'