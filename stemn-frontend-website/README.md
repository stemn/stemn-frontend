# Stemn Frontend Website

Anyone can get the [Stemn Website](https://stemn.com/) running locally and develop new features. The entire frontend is open-source!

## Install
1. Make sure you have `git` and `node` installed.
2. Clone the parent repo: `stemn-frontend`.
3. `cd` into this folder (stemn-frontend-website) and run `npm run install:link`

## Build Development
* `npm start` to build the src
* Open [http://localhost:3000/](http://localhost:3000/)

## Build Production

* `npm run build` to buld the production src
* `npm run build:serve` to serve this dist on [http://localhost:3000/](http://localhost:3000/)

## Deploy

Note:
Only members of the Stemn Team can deploy - open source devs will need to submit a PR.

People with access should:
Make sure the **stemn-website-live** repo is cloned and in `../../stemn-website-live`

* `npm run build`. This will build the minified dist for production use.
* `npm run deploy`. This will copy the dist to the stemn-website-live repo.
* `npm run release`. Inside the `stemn-website-server` repo
