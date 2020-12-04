import path from 'path'
import fetch from 'node-fetch'
import electron from 'electron'
import compareVersions from 'compare-versions';
import gh from 'github-url-to-object';

interface Options {
  repository?: string
  token?: string,
  debug?: boolean,
}

interface GithubReleaseObject {
  tag_name: string,
  body: string,
  html_url: string,
}

export const defaultOptions: Options = {
  debug: false
};

export function setUpdateNotification(options: Options = defaultOptions) {
  if (electron.app.isReady()) {
    checkForUpdates(options)
  } else {
    electron.app.on('ready', () => {
      checkForUpdates(options)
    })
  }
}

export async function checkForUpdates({repository, token, debug}: Options = defaultOptions) {
  if (!electron.app.isPackaged && !debug) return

  if (!repository) {
    const pkg = require(path.join(electron.app.getAppPath(), 'package.json'))
    const ghObj = gh(pkg.repository)

    if (!ghObj) {
      throw new Error('Repository URL not found in package.json file.');
    }

    repository = ghObj.user + '/' + ghObj.repo
  }

  let latestRelease: null | any = null;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/releases`,
      {
        headers: token ? {authorization: `token ${token}`} : {},
        timeout: 30000, // ms
      },
    )
    const json = await response.json()
    latestRelease = json[0]
  } catch (error) {
    console.error(error)
  }

  if (!latestRelease) return

  if (compareVersions.compare(latestRelease.tag_name, electron.app.getVersion(), '>')) {
    showUpdateDialog(latestRelease)
  }
}

export function showUpdateDialog(release: GithubReleaseObject) {
  electron.dialog.showMessageBox(
    {
      title: electron.app.getName(),
      type: 'info',
      message: `New release available`,
      detail: `Version: ${release.tag_name}\n\n${release.body}`.trim(),
      buttons: ['Download', 'Later'],
      defaultId: 0,
      cancelId: 1,
    },
  )
    .then(({response}) => {
      if (response === 0) {
        setImmediate(() => {
          electron.shell.openExternal(release.html_url)
        })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
