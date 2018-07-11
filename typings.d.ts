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

declare module '*.jsx' {
  const jsx: any;
  export = jsx;
}