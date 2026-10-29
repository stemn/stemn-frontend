import { describe, expect, it } from 'vitest'
import { contentfulReducer as reducer } from './Contentful.reducer'

const response = {
  items: [
    {
      sys: { id: 'page1', contentType: { sys: { id: 'pageExplore' } } },
      fields: { id: 'explore', featuredItems: [{ sys: { id: 'item1', type: 'Link' } }] },
    },
  ],
  includes: {
    Entry: [
      {
        sys: { id: 'item1', contentType: { sys: { id: 'featuredItem' } } },
        fields: { title: 'Gearbox', image: { sys: { id: 'asset1', type: 'Link' } } },
      },
    ],
    Asset: [{ sys: { id: 'asset1' }, fields: { title: 'Gearbox image', file: { url: '//images/gear.png' } } }],
  },
}

describe('Contentful reducer', () => {
  const prev: any = { pageHome: [{ sys: { id: 'home' }, fields: {} }] }

  it('CONTENTFUL/GET_ENTRIES_FULFILLED stores the populated entries by content type', () => {
    const next: any = reducer(prev, {
      type: 'CONTENTFUL/GET_ENTRIES_FULFILLED',
      meta: { contentType: 'pageExplore' },
      payload: { data: response },
    })
    expect(next.pageHome).toBe(prev.pageHome)
    expect(next.pageExplore).toHaveLength(1)
    const [page] = next.pageExplore
    expect(page.sys).toEqual({ id: 'page1', contentType: 'pageExplore' })
    expect(page.fields.featuredItems[0].fields.title).toBe('Gearbox')
    expect(page.fields.featuredItems[0].fields.image.fields.file.url).toBe('//images/gear.png')
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
