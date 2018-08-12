# Clean the dist
rm -rf ./dist;

# Env cvars
export NODE_ENV=production;
export API_SERVER=https://stemn.com;
export WEBSOCKET_SERVER=https://stemn.com:8443;
export ELECTRON_CRASH_REPORT_SERVER=https://stemn.com:2096;

# Build the renderer code
webpack --config ./config/webpack.config.electron.js

# Build the electron code
webpack --config ./config/webpack.config.renderer.production

# Build the renderer html
node ./scripts/buildHtml.js
