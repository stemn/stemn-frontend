import { app } from 'electron'
import { windows } from 'stemn-frontend-desktop/app/main/index.js'
import { create as createPreview } from 'stemn-frontend-desktop/app/main/createPreviewWindow.js'
import querystring from 'querystring'

export const create = ({ type, props }) => {
  if (type === 'PREVIEW') {
    const queryParams = querystring.stringify(props)
    createPreview({ uri: queryParams ? `?${queryParams}` : '' })
  } else {
    console.error('Window could not be created')
  }
}

export const hide = ({ window }) => {
  if (windows[window]) {
    windows[window].browserWindow.hide()
  } else {
    console.error('Window could not be found')
  }
}

export const show = ({ window }) => {
  if (windows[window]) {
    windows[window].show()
  } else {
    console.error('Window could not be found')
  }
}

export const quit = () => {
  app.quit()
}

export const relaunch = () => {
  app.relaunch()
  app.exit(0)
}

