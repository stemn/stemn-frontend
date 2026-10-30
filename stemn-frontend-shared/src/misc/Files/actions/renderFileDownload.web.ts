import { renderFileDownloadUrl } from './renderFileDownloadUrl'

// When we are on web (and we know the render is complete)
// we set the render path to the store instead of downloading it.
export const renderFileDownload = ({ projectId, fileId, revisionId = '', timestamp, cadProvider = undefined }) =>
  renderFileDownloadUrl({ projectId, fileId, revisionId, timestamp, cadProvider })
