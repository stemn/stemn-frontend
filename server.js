/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.development';

import stemn from '../stemn/server/app/app';

const app = express();
const compiler = webpack(config);
const PORT = 3000;

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

app.use(stemn);

app.listen(PORT, 'localhost', err => {
  if (err) {
    return;
  }

  console.log(`Listening at http://localhost:${PORT}`);
});
