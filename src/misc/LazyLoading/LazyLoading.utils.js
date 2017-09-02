export const resources = {

}

const getSrcSplit = (src) => {
  const queryParamsIndex = src.indexOf('?')
  if (queryParamsIndex > 0) {
    return src.substring(0, src.indexOf('?')).split('.')
  } 
  return src.split('.')
}

export const load = (items) => {
  const promiseArray = []

  const loadStyles = (srcUrl) => {
    const promise = new Promise((resolve, reject) => {
      const callback = () => {
        resources[srcUrl] = true
        resolve('Styles Loaded')
      }
      const linkTag = document.createElement('link')
      linkTag.href = srcUrl
      linkTag.rel = 'stylesheet'
      linkTag.type = 'text/css'
      linkTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          callback()
        }
      }
      linkTag.onload = callback
      document.getElementsByTagName('head')[0].appendChild(linkTag)
    })
    resources[srcUrl] = promise
    return promise
  }

  const loadScript = (srcUrl, globalName) => {
    const promise = new Promise((resolve) => {
      const callback = () => {
        resources[srcUrl] = true
        if (window[globalName]) {
          resolve(window[globalName])
        } else {
          resolve('Js Loaded')
        }
      }

      const scriptTag = document.createElement('script')
      scriptTag.type = 'text/javascript'
      scriptTag.async = true
      scriptTag.src = srcUrl
      scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          callback()
        }
      }
      scriptTag.onload = callback
      document.getElementsByTagName('body')[0].appendChild(scriptTag)
    })
    resources[srcUrl] = promise
    return promise
  }

  // If we have some scripts to load, try and load them
  if (items) {
    items.forEach((item) => {
      // If the src is not yet registered, register it
      if (!resources[item.src]) {
        const srcSplit = getSrcSplit(item.src)
        const fileType = item.type || srcSplit[srcSplit.length - 1]

        if (fileType === 'js') {
          promiseArray.push(loadScript(item.src, item.global))
        } else if (fileType === 'css') {
          promiseArray.push(loadStyles(item.src))
        } else {
          console.error('Unsupported file type')
        }
      } else if (resources[item.src] !== true) {
        // Else, if it is not true, it is loading and the promise is assigned
        promiseArray.push(resources[item.src])
      }
    })
  }


  return Promise.all(promiseArray)
}

