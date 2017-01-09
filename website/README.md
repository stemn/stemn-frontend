## Developing
Site will run on  [localhost:3333](http://localhost:3333)
* `npm run server`
* `npm run server:test` (This will point to test server api)

Set up a symlink to link the `stemn-frontend-shared` repo into the `website/node_modules/stemn-frontent-shared` folder.
In Windows this is done with `mklink /J "C:\Users\david\repositories\stemn-frontend\website\node_modules\stemn-frontend-shared" "C:\Users\david\repositories\stemn-frontend-shared"`



### Build files
* single run: `npm run build`

## Testing
* single run: `npm test`
* live mode (TDD style): `npm run test-watch`

### Notes
Basic webpack config from [angular-webpack](https://david-dm.org/preboot/angular-webpack)
