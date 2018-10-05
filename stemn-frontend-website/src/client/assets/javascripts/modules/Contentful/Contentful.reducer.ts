import * as i from 'icepick'
import { keyBy } from 'lodash'
import { IContentfulContentPageExplore } from 'modules/Contentful/types'
import { populate, transform } from './utils'

export interface IContentfulState {
  pageExplore?: IContentfulContentPageExplore[]
}

const initialState = {}

export const contentfulReducer = (state: IContentfulState = initialState, action) => {
  switch (action.type) {
    case 'CONTENTFUL/GET_ENTRIES_FULFILLED': {
      const { items, assets, entries } = transform(action.payload.data)
      // Key items by id
      const newEntries = keyBy(entries, 'sys.id')
      const newAssets = keyBy(assets, 'sys.id')
      // Add the entries and assets to the state
      const entriesAndAssets = { ...newEntries, ...newAssets }
      return i.assoc(state, action.meta.contentType, populate(entriesAndAssets, items))
    }
    default:
      return state
  }
}
