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

To build the app:
bump the version in the app/package.json
`npm run build`             you may need to increase memory using `node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js ...`
`node scripts/build.js`     flags: -windows || -mac || -linux