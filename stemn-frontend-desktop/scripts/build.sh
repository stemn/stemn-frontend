# Clean the dist
rm -rf ./dist;

# Build the renderer code
webpack --config ./config/webpack.config.electron.js

# Build the electron code
webpack --config ./config/webpack.config.renderer.production

# Build the renderer html
node ./scripts/buildHtml.js
