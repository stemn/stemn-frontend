## Usage

### Babel and Webpack Setup
* `npm install` to make sure the babel presets are installed.
* Make sure there is a babel-loader (that includes `stemn-frontend-shared`) in the main webpack.config:
```
  {
    test      : /(\.js|\.jsx)$/,
    loader    : 'babel',
    include: [
      path.resolve(__dirname, './app/node_modules/stemn-frontend-shared')
    ]
  }
```
* Add the following webpack aliases ( for 'stemn-shared', 'theme', and 'route-actions') to the webpack.config. Such as:
```
  'theme'            : path.resolve(__dirname, './src/theme.css'),
  'route-actions'    : path.resolve(__dirname, './src/routeActions.js'),
  'stemn-shared'     : path.resolve(__dirname, './node_modules/stemn-frontend-shared/src'),
```