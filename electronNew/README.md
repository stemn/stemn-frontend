# Stemn Website

Anyone can get the Stemn Desktop App running locally and develop new features. The entire frontend is open-source!

### Install
1. Make sure you have `git` and `node` installed.
2. Clone this repo.
3. Clone the [`stemn-frontend-shared`](https://github.com/stemn/stemn-frontend-shared) repo.
4. `cd` into `stemn-frontend-shared` and run `npm link stemn-frontend-shared` to initiate the npm link.
5. `cd` into `stemn-frontend/electronNew` and run `npm install`
6. `cd` into `stemn-frontend/electronNew/app` and run `npm install`
7. `cd` into `stemn-frontend/electronNew/app` and run `npm link stemn-frontend-shared`

## Development

Run these two commands __simultaneously__ in different console tabs.

```bash
$ npm run start:electron  - This will start the electron build server
$ npm run start:renderer  - This will start the renderer build server
```

Then, in a 3rd terminal, start electron
```bash
$ npm run electron
```

## Deploy

Note:
Only members of the Stemn Team can deploy - open source devs will need to submit a PR.

Releasing depends on 3 different repos.
Releases are compiled in the cloud by AppVeyor and TravisCI.

People with access should:

1. Bump the version in the `package.json` AND `app/package.json`
2. Build the app using `npm run build` - make sure it works using `npm run electron`
3. Create a new tag on [GitHub](https://github.com/Stemn/Stemn-Desktop/releases)
4. Run the `release.sh/bat`. This will build the dist, copy into the release repo and push it up to the CI servers.
5. Monitor CI status at [AppVeyor](https://ci.appveyor.com/project/MrBlenny/stemn-desktop) and [Travis](https://travis-ci.org/Stemn/Stemn-Desktop)
6. Releases will appear on [GitHub](https://github.com/Stemn/Stemn-Desktop/releases). Test these releases.
7. Publish the releases on GitHub.
8. Finally, run `update.sh/bat` in the [Stemn-Updates](https://github.com/Stemn/Stemn-Updates) repo. This will bump the numbers in `updates.json`

