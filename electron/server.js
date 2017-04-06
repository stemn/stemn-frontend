/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);

const PORT = 3001;

//compiler.apply(new DashboardPlugin({port: PORT}));

compiler.plugin('compile', () => {
  console.log('Begin Webpack Build...');
});

compiler.plugin('done', (stats) => {
  console.log('Build Complete.');
  // https://webpack.github.io/analyse/
  fs.writeFileSync('./stats.json', JSON.stringify(stats.toJson()));
  console.log('Stats.json created');
});

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

app.listen(PORT, 'localhost', err => {
  if (err) {
    return;
  }
  console.log(`Listening on http://localhost:${PORT}..`);
});
