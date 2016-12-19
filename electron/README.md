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
3. Run the `release.sh/bat`. This will build the dist, copy into the release repo and push it up to the CI servers.
4. Monitor CI status at [AppVeyor](https://ci.appveyor.com/project/MrBlenny/stemn-desktop) and [Travis](https://travis-ci.org/Stemn/Stemn-Desktop)
5. Releases will appear on [GitHub](https://github.com/Stemn/Stemn-Desktop/releases). Test these releases.
6. Publish the releases on GitHub.
7. Finally, run `update.sh/bat` in the [Stemn-Updates](https://github.com/Stemn/Stemn-Desktop) repo. This will bump the numbers in `updates.json`