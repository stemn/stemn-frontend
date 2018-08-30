import { forOwn, get } from 'lodash'

const transformItemFields = (fields) => {
  // If fields does not exist, we do nothing
  // Otherwise we will be setting it to {}
  if (!fields) {
    return fields
  }
  const transformedFields = {}
  forOwn(fields, (value, key) => {
    transformedFields[key] = Array.isArray(value)
      ? value.map((item) => transformItem(item))
      : transformItem(value)
  })
  return transformedFields
}

const transformItem = (item) => (item && item.sys ? {
  fields: transformItemFields(item.fields),
  sys: {
    id: item.sys.id,
    contentType: get(item, 'sys.contentType.sys.id', 'asset'),
  },
} : item)

/**
 * Data from contentful comes in the form { fields, sys }
 * We want to clean up the { sys } portion
 */
export const transform = (data) => ({
  items: get(data, 'items', []).map(transformItem),
  assets: get(data, 'includes.Asset', []).map(transformItem),
  entries: get(data, 'includes.Entry', []).map(transformItem),
})

const populateEntryField = (entriesAndAssets, entryField) => {
  // This will fetch the populated item from the entries and assets store if possible.
  if (entryField.sys && !entryField.fields) {
    const entry = entriesAndAssets[entryField.sys.id]
    // Populate the children
    return populateEntry(entriesAndAssets, entry)
  }
  return entryField
}

const populateEntry = (entriesAndAssets, entry) => {
  const entryFields = {}
  // For each field...
  forOwn(entry && entry.fields, (value, key) => {
    entryFields[key] = Array.isArray(value)
      ? value.map((item) => populateEntryField(entriesAndAssets, item))  // If it is an array, we try populated everything in the array
      : populateEntryField(entriesAndAssets, value)  // Otherwise we populate as usual
  })

  return {
    ...entry,
    fields: {
      ...entryFields,
    },
  }
}

/**
 * Populate the entry with the assets and related entries
 */
export const populate = (entriesAndAssets, entries) => entries.map((entry) => populateEntry(entriesAndAssets, entry))
