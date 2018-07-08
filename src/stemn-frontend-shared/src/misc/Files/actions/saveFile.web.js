import http from 'axios'

export default ({ file, fileUrl, anchorEl }) => (dispatch, getState) => http({
  method: 'GET',
  url: `/api/v1/sync/shareLink/${file.project._id}/${file.fileId}?revisionId=${file.revisionId}`,
}).then(({ data }) => {
  // We modify the anchor tag directly.
  // Yes, I know. Not very reacty.
  // We need this all to be sync. This seems nicer than updating the state with the new download and href attributes
  anchorEl.setAttribute('download', file.name)
  anchorEl.setAttribute('href', `${GLOBAL_ENV.API_SERVER}/api/v1/sync/shareDownload?token=${data.token}`)
  // Now, we simulate the click to start the download
  // The anchor's onClick function should check that href does not exist
  // Otherwise this will loop.
  anchorEl.click()
})
