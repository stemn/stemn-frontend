## Development

### Install

First, clone the repo via git and install dependencies:

```bash
$ npm install
```

### Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run serve
$ npm run app
```

### Package and Release

To build the app:
bump the version in the app/package.json
`npm run build`       you may need to increase memory using `node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js ...`
`npm run compile`     