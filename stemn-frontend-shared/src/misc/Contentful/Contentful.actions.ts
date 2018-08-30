import http from 'axios'
import { IGetState } from 'reducer'

const contentfulUrl = 'https://cdn.contentful.com'
const contentfulSpaceId = '048s8d72rxi2'
const contentfulToken = 'd18fcc4999397563bce6b8887c4062b644791824831fea32de102eed2c0f8790'

export interface IGetEntriesInput {
  contentType: string,
}

export const getEntries = ({ contentType }: IGetEntriesInput) => async (dispatch, getState: IGetState) => {
  if (!getState().contentful[contentType]) {
    return dispatch({
      type: 'CONTENTFUL/GET_ENTRIES',
      payload: http({
        method: 'GET',
        url: `${contentfulUrl}/spaces/${contentfulSpaceId}/entries`,
        headers: {
          Authorization: null,
        },
        params: {
          access_token: contentfulToken,
          content_type: contentType,
          include: 3,
        },
      }),
      meta: {
        contentType,
      },
    })
  }
}
