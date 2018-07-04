# Clean the build
rm -rf ./build;
export NODE_ENV=production;
# Build prod
webpack --config ./config/webpack.config.production.js;
# Build the html
node ./scripts/buildHtml.js;
# Copy server to dist
cp -a ./src/server ./build/server