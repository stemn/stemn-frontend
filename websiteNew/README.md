## Development

There are two ways in which you can build and run the web app:
* Hot reloading via webpack middlewares:
  * `$ npm start`
  * Point your browser to http://localhost:3000/, page hot reloads automatically when there are changes
  
* Build once for (ready for ***Production***):
  * `$ npm run build`
  * `$ npm run build:serve`

  The last command will boot up HTTP server on `3000` port and serve `build/client` directory in a default browser

### How do I deploy this?

`npm run build`. This will prepare and build the project for production use.
`npm run deploy`. This will copy the dist to the stemn-website-live repo where it will then be pushed and pulled on the server
