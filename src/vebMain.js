const request = require('request')

const vebMain = ipcMain => {
  if (!(ipcMain && ipcMain.on)) {
    throw new TypeError(`require ipcMain`)
  }

  ipcMain.on('vue-electron-baidu-analyze-message', (event, arg) => {
    request({
      url: `https://hm.baidu.com/hm.js?${arg}`,
      headers: {
        'Referer': 'https://hm.baidu.com/'
      }
    }, (error, response, body) => {
      if (body && body.indexOf('function') > -1) {
        event.sender.send('vue-electron-baidu-analyze-reply', res.text)
      }
    })
  })
}

const vebRenderer = (ipcRenderer, siteId, router) => {
  if (!(ipcRenderer && ipcRenderer.on && ipcRenderer.send)) {
    throw new TypeError(`require ipcRenderer`)
  }

  if (!(siteId && typeof siteId === 'string')) {
    throw new TypeError(`require siteId`)
  }

  ipcRenderer.on('vue-electron-baidu-analyze-reply', (_, arg) => {
    window._hmt = window._hmt || []

    let hm = document.createElement('script')
    hm.text = arg

    let head = document.getElementsByTagName('head')[0]
    head.appendChild(hm)

    // Vue单页应用时，监听router的每次变化
    // 把虚拟的url地址赋给百度统计的API接口

    /* istanbul ignore else */
    if (router && router.beforeEach) {
      router.beforeEach((to, _, next) => {
        /* istanbul ignore else */
        if (to.path) {
          window._hmt.push(['_trackPageview', '/#' + to.fullPath])
        }

        next()
      })
    }
  })

  // step 1
  ipcRenderer.send('electron-baidu-tongji-message', siteId)
}

export {
  vebMain
}
