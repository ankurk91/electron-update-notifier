# Electron App Update Notifier

[![downloads](https://badgen.net/npm/dt/electron-update-notifier)](http://npm-stats.com/~packages/electron-update-notifier)
[![npm-version](https://badgen.net/npm/v/electron-update-notifier)](https://www.npmjs.com/package/electron-update-notifier)
[![github-tag](https://badgen.net/github/tag/ankurk91/electron-update-notifier)](https://github.com/ankurk91/electron-update-notifier/)
[![license](https://badgen.net/github/license/ankurk91/electron-update-notifier)](https://yarnpkg.com/en/package/electron-update-notifier)
[![install size](https://packagephobia.com/badge?p=electron-update-notifier)](https://packagephobia.com/result?p=electron-update-notifier)
[![build](https://github.com/ankurk91/electron-update-notifier/workflows/build/badge.svg)](https://github.com/ankurk91/electron-update-notifier/actions)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)

Notify user about new app updates by fetching release from Github repository.

![screenshot](/.github/static/update-dialog.png)

## Motivation

[update-electron-app](https://github.com/electron/update-electron-app) is an auto updating solution for open source
Electron apps. It is awesome but has some limitations:

- It does not support Linux currently
- Applications on macOS must be signed in order to work.

This package comes to help in these cases. Instead of downloading installer automatically, it simply notifies user to go
to GitHub release page when updates available.

## Installation

```sh
yarn add electron-update-notifier
# OR
npm install electron-update-notifier
```

## Usage

Auto check for updates on app start

```js
const {app} = require('electron');
const {setUpdateNotification} = require('electron-update-notifier');

app.whenReady().then(() => {
    setUpdateNotification({
        repository: 'user/repo', // Optional, use repository field from your package.json when not specified
        token: '', // Optional, GitHub api access token
        debug: false, // Optional, default `false`, allows to check for updates during development as well
        silent: true // Optional, notify when new version available, otherwise remain silent 
    })
})
```

Check for updates manually

```js
const {checkForUpdates} = require('electron-update-notifier');

checkForUpdates({
    // options 
    silent: false, // Warn about network failures and notify when there is no updates
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
