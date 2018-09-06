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
}

declare const GLOBAL_ENV: GLOBAL_ENV