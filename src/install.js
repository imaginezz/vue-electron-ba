import autoPageview from './directives/auto-pageview'
import trackEvent from '././directives/track-event'
import trackPageview from '././directives/track-pageview'
export default function install(Vue, options) {
  if (this.install.installed) return

  if (options.debug) {
    this.debug = console.log
  } else {
    this.debug = () => {}
  }

  let siteId = null

  if (typeof options === 'object') {
    siteId = options.siteId
    if (options.autoPageview !== false) {
      options.autoPageview = true
    }
    const ipcRenderer = options.ipcRenderer
    ipcRenderer.on('vue-electron-baidu-analyze-reply', (_, arg) => {
      window._hmt = window._hmt || []

      let hm = document.createElement('script')
      hm.text = arg

      let head = document.getElementsByTagName('head')[0]
      head.onload = () => {
        // if the global object is exist, resolve the promise, otherwise reject it
        if (window._hmt) {
          this._resolve()
        } else {
          console.error('loadings ba statistics script failed, please check src and siteId')
          return this._reject()
        }
        this._cache.forEach((cache) => {
          window._hmt.push(cache)
        })
        this._cache = []
      }
      head.appendChild(hm)
    })
    ipcRenderer.send('vue-electron-baidu-analyze-message', siteId)
  } else {
    return console.error(' options must be object')
  }

  if (!siteId) {
    return console.error(' siteId is missing')
  }

  this.install.installed = true

  Object.defineProperty(Vue.prototype, '$ba', {
    get: () => this
  })

  Vue.directive('auto-pageview', autoPageview)
  Vue.directive('track-event', trackEvent)
  Vue.directive('track-pageview', trackPageview)
}
