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
Releasing depends on 3 repos: 2 public GitHub repos and this private repo. Releases are compile in the cloud by AppVeyor and TravisCI.

1. Bump the version in the `package.json` AND `app/package.json`
2. Create a new tag on [GitHub](https://github.com/Stemn/Stemn-Desktop/releases)
3. Run `npm run build` (you may need to increase memory using `node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js ...`)
4. Run the `release.sh` or `release.bat`. This will copy the dist into the release repo and push it up to the CI servers.
5. Monitor CI status at [AppVeyor](https://ci.appveyor.com/project/MrBlenny/stemn-desktop) and [Travis](https://travis-ci.org/Stemn/Stemn-Desktop)
6. Releases will appear on [GitHub](https://github.com/Stemn/Stemn-Desktop/releases). Test these releases.
7. Publish the releases on GitHub.
8. Finally, bump the numbers in `updates.json` in the [Updates Github Repo](https://github.com/Stemn/Stemn-Desktop)