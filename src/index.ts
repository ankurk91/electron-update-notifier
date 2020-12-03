import path from 'path'
import fetch from 'node-fetch'
import electron from 'electron'
import compareVersions from 'compare-versions';

const gh = require('github-url-to-object')

interface Options {
  repository?: string
  token?: string,
}

export function setUpdateNotification(options: Options = {}) {
  if (electron.app.isReady()) {
    checkUpdate(options)
  } else {
    electron.app.on('ready', () => {
      checkUpdate(options)
    })
  }
}

export async function checkUpdate({repository, token}: Options = {}) {
  if (!electron.app.isPackaged) return

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

export function showUpdateDialog(latestRelease: any) {
  electron.dialog.showMessageBox(
    {
      title: electron.app.getName(),
      type: 'info',
      message: `New release available`,
      detail: `Version: ${latestRelease.tag_name}\n\n${latestRelease.body}`.trim(),
      buttons: ['Download', 'Later'],
      defaultId: 0,
      cancelId: 1,
    },
  )
    .then(({response}) => {
      if (response === 0) {
        setImmediate(() => {
          electron.shell.openExternal(latestRelease.html_url)
        })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
