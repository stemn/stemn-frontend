## Development

### Install

First, clone the repo via git and install dependencies:

```bash
$ npm install
```

### Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run server
$ npm run app
```

### Release
* bump the version in the `package.json` AND `app/package.json`
* `npm run build`       you may need to increase memory using `node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js ...`
* `cd` into the [GitHub](https://github.com/Stemn/Stemn-Desktop) release repo `stemn-desktop-release`
* Run the `release.sh` or `release.bat`. This will copy the dist into the release repo and push it up to the CI servers.
* Monitor CI status at [AppVeyor](https://ci.appveyor.com/project/MrBlenny/stemn-desktop) and [Travis](https://travis-ci.org/Stemn/Stemn-Desktop)
* A new release will be created [here](https://github.com/Stemn/Stemn-Desktop/releases)
* Test this release and publish it if it works!
* Finally, update the `updates.json` in the [Github Repo](https://github.com/Stemn/Stemn-Desktop)