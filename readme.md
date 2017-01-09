## Usage
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