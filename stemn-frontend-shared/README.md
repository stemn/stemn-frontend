# Stemn Frontend Shared

This code is shared between `stemn-frontend-website` and `stemn-frontend-desktop`. It is designed to be installed as a dependency in these projects using `npm link`.

## Usage

* `npm link` in the root of this folder.
* `cd ../stemn-frontend-desktop && npm link stemn-frontend-shared` to install it in the desktop project
* `cd ../stemn-frontend-website && npm link stemn-frontend-shared` to install it in the desktop project

### Note
* Mark dependencies as `peerDependencies`. These should be installed in the parent project to prevent duplication.