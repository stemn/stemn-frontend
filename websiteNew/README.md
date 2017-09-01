## Install

1. Clone this repo.
2. Clone the `stemn-frontend-shared` repo.
3. `cd` into `stemn-frontend-shared` and run `npm link stemn-frontend-shared` to initiate the npm link.
4. `cd` into `stemn-frontend/websiteNew` and run `npm install`
6. `cd` into `stemn-frontend/websiteNew` and run `npm link stemn-frontend-shared`

## Development

There are two ways in which you can build and run the web app:
* Hot reloading via webpack middlewares:
  * `$ npm start`
  * Point your browser to http://localhost:3000/, page hot reloads automatically when there are changes
  
* Build once for (ready for ***Production***):
  * `$ npm run build`
  * `$ npm run build:serve`

  The last command will boot up HTTP server on `3000` port and serve `build/client` directory in a default browser

### Deploy
Note:
Only members of the Stemn Team can deploy - open source devs will need to submit a PR.

People with access should:
Make sure the **stemn-website-live** repo is cloned and in `../../stemn-website-live`
`npm run build`. This will build the minified dist for production use.
`npm run deploy`. This will copy the dist to the stemn-website-live repo.
`npm run release`. Inside the `stemn-website-server` repo
