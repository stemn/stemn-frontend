rm -rf;
export NODE_ENV=production;
webpack --config ./config/webpack.config.production.js;
node ./scripts/buildHtml.js;