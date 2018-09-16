declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.svg' {
  const svg: any;
  export default svg;
}

interface GLOBAL_ENV {
  API_SERVER: string,
  APP_TYPE: 'web' | 'desktop',
  WEBSITE_URL: string,
}
declare const GLOBAL_ENV: GLOBAL_ENV

declare module '@stemn/whats-that-gerber' {
  const lib: (fileName: string) => string;
  export = lib;
}
