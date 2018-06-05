import { sendAuthToken } from 'stemn-shared/misc/Auth/Auth.actions.js'

const pageHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authorisation Successful</title>
  </head>
  <body style="font-family: sans-serif; background: rgba(0, 0, 0, 0.03);">
    <div style="width: 400px;
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);
      box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
      padding: 15px;
      color: rgba(0, 0, 0, 0.8);
      background: white;
      line-height: 1.3em;
      font-size: 14px">
      <b style="margin-bottom: 10px; display: block;">Authorisation Successful</b>
      <div>You can close this window and return to Stemn Desktop.</div>
      <div style="text-align: right; margin-top: 25px">
        <a style="text-decoration: none;" href="stemn:open">Open Stemn</a>
      </div>
    </div>
  </body>
  <script>
    window.top.close();
  </script>
</html>`

export const authGoogle = (req, res) => {
  req.store.dispatch(sendAuthToken({
    provider: 'google',
    code: req.query.code,
  }))
  res.send(pageHtml)
}

export const authDropbox = (req, res) => {
  console.log('req.originalUrl:', req.originalUrl)
  req.store.dispatch(sendAuthToken({
    provider: 'dropbox',
    code: req.query.code,
  }))
  res.send(pageHtml)
}

export const authFacebook = (req, res) => {
  req.store.dispatch(sendAuthToken({
    provider: 'facebook',
    code: req.query.code,
  }))
  res.send(pageHtml)
}

export const authLinkedin = (req, res) => {
  req.store.dispatch(sendAuthToken({
    provider: 'linkedin',
    code: req.query.code,
  }))
  res.send(pageHtml)
}
