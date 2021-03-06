export interface IProject {
  _id: string,
  name: string,
  blurb: string,
  location: string[],
  picture: string,
  updated: string,
  stub: string,
  clone?: {
    source: string,
  },
  remote: {
    provider: string,
  },
  private: boolean
}
