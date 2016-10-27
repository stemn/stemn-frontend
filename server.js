/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import config from './webpack.config.development';

const app = express();
const compiler = webpack(config, (err, stats) => {
  /*******************************************
  Write the stats.json for analysis using:
  - http://webpack.github.io/analyse/
  - https://alexkuz.github.io/webpack-chart/
  - https://chrisbateman.github.io/webpack-visualizer/
  
  ********************************************/
  fs.writeFileSync('./stats.json', JSON.stringify(stats.toJson()));
});
const PORT = 3001;

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

  console.log(`Listening at http://localhost:${PORT}`);
});
