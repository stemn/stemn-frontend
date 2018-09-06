import { segmentEnabled } from './Analytics.init'

export const track = (event: string, properties: string) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.track(event, properties)
  }
}

export const identify = (traits: object) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.identify(traits)
  }
}

export const reset = () => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.reset()
  }
}

export const page = (name: string, properties: object) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.page(name, properties)
  }
}
