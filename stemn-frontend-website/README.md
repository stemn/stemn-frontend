# Stemn Frontend Website

Anyone can get the [Stemn Website](https://stemn.com/) running locally and develop new features. The entire frontend is open-source!

## Development

### Install

1. Make sure you have `git` and `node` installed.
2. Clone the parent repo: `stemn-frontend`.
3. `cd` into this folder (stemn-frontend-website)
4. `npm run install:link` to install the dependencies and `npm link` the `stemn-frontend-shared` folder

### Build Development

* `npm run dev` to start the dev server on [http://localhost:3000/](http://localhost:3000/)

### Build Production

* `npm run build` to build the production dist to `/build`
* `npm run serve` to serve this dist on [http://localhost:3000/](http://localhost:3000/)

### Deploy

Note:
Any code that is merged into the `production` or `staging` branches (and passes CI) will be automatically deployed.

## Branches

This project has 2 main branches:

* `staging` - this will be deployed to staging.stemn.com
* `production` - this will be deployed to stemn.com
