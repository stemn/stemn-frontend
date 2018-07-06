# Stemn Frontend Website

Anyone can get the [Stemn Website](https://stemn.com/) running locally and develop new features. The entire frontend is open-source!

### Table of Contents

1. [Development](#development)
2. [Branches](#branches)
3. [Contributing](#contributing)

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

Any code that is merged into the `production` or `staging` branches (and passes CI) will be automatically deployed.

## Branches

This project has 2 main branches:

* `staging` - staging.stemn.com
* `production` - stemn.com

## Contributing

* Fork this repo
* Follow the __Development__ guide above
* Submit a MR targeting the `staging` branch
* Make sure the CI pipeline is passing
* We will review and merge ASAP