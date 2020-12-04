# Electron Update Notifier

[![downloads](https://badgen.net/npm/dt/electron-update-notifier)](http://npm-stats.com/~packages/electron-update-notifier)
[![npm-version](https://badgen.net/npm/v/electron-update-notifier)](https://www.npmjs.com/package/electron-update-notifier)
[![github-tag](https://badgen.net/github/tag/ankurk91/electron-update-notifier)](https://github.com/ankurk91/electron-update-notifier/)
[![license](https://badgen.net/github/license/ankurk91/electron-update-notifier)](https://yarnpkg.com/en/package/electron-update-notifier)
[![install size](https://packagephobia.com/badge?p=electron-update-notifier)](https://packagephobia.com/result?p=electron-update-notifier)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)

Notify user about new app updates by fetching release from Github repository.

## Motivation
[update-electron-app](https://github.com/electron/update-electron-app) is an auto updating solution for open source Electron apps. 
It is awesome but has some limitations:

- It does not support Linux currently
- macOS applications must be signed in order to work.

This package comes to help in these cases. Instead of downloading installer automatically, 
it simply notifies user to go to GitHub release page when updates available.

## Installation
```sh
yarn add electron-update-notifier
# OR
npm install electron-update-notifier
```

## Usage
```js
const { setUpdateNotification } =  require('electron-update-notifier');

setUpdateNotification({
  repository: 'user/repo', // Optional, use repository field from your package.json when not specified
  token: '', // Optional, GitHub api access token
  debug: false, // Optional, default `false`, allows to check for updates during development as well
})
```

Use it with [update-electron-app](https://github.com/electron/update-electron-app):

```js
switch (process.platform) {
  case 'darwin':
  case 'win32':
    require('update-electron-app')()
    break
  default:
    require('electron-update-notifier').setUpdateNotification({
      // options
    })
}
```

## Acknowledgements
[@pd4d10](https://github.com/pd4d10) for original work

## License
[MIT](LICENSE.txt) License
