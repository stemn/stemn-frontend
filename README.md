## Development

### Install

First, clone the repo via git:

And then install dependencies.

```bash
$ npm install
```


### Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

*Note: requires a node version >= 4 and an npm version >= 2.*

### Package and Release

To build the app for windows run

```bash
npm run build - you may need to increase memory using `node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js ...`
node scripts/build.js     flags: -windows || -osx || -linux
```


### Contributors

Special thanks go to:

* [Jack Wilkinson](https://github.com/guacjack)

> Originally based on the fantastic [chentsulin/electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
> MIT © [C. T. Lin](https://github.com/chentsulin)
>
> [Electron](http://electron.atom.io/) application boilerplate based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development
