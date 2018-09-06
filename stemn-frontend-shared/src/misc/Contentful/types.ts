export interface IContentfulSys {
  id: string,
  contentType: string,
}

export interface IContentfulMedia {
  sys: IContentfulSys,
  fields: {
    title: string,
    file: {
      contentType: string,
      details: {
        size: number,
        image: {
          width: number,
          height: number,
        },
      },
      fileName: string,
      url: string,
    },
  }
}

export interface IContentfulContentGeneric {
  fields: any,
  sys: IContentfulSys
}

export interface IContentfulContentPageExplore {
  sys: IContentfulSys,
  fields: {
    id: string,
    featuredItems: Array<{
      sys: IContentfulSys,
      fields: {
        title: string,
        description: string,
        link: string,
        image: IContentfulMedia,
      },
    }>,
  }
}
