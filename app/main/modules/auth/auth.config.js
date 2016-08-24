export const oauthCreds = {
  facebook: {
    url                   : 'https://www.facebook.com/dialog/oauth',
    postUrl               : 'http://localhost:3000/api/v1/auth/facebook',
    params                : {
      redirect_uri        : 'https://stemn.com/auth/facebook',
      client_id           : '710281375734499',
    },
  },
  google: {
    url                   : 'https://accounts.google.com/o/oauth2/v2/auth',
    postUrl               : 'http://localhost:3000/api/v1/auth/google',
    params                : {
      redirect_uri        : 'https://stemn.com/auth/google',
      response_type       : 'token',
      client_id           : '502305750839-8m9aian8ka9qb6j64t3dtjs2nq96tdae.apps.googleusercontent.com',
      scope               : 'openid profile email https://www.googleapis.com/auth/drive',
    },
  },
  linkedin: {
    url                   : 'https://www.linkedin.com/oauth/v2/authorization',
    postUrl               : 'http://localhost:3000/api/v1/auth/google',
    params                : {
      response_type       : 'code',
      redirect_uri        : 'https://stemn.com/auth/linkedin',
      client_id           : '75gm1u1gda1xoe',
      scope               : ['r_fullprofile', 'r_emailaddress'],
    },
  },
  dropbox: {
    url                   : 'https://www.dropbox.com/oauth2/authorize',
    postUrl               : 'http://localhost:3000/api/v1/auth/dropbox',
    params                : {
      redirect_uri        : 'https://stemn.com/auth/dropbox',
      response_type       : 'token',
      client_id           : '0wgo11dn573805b'
    },
  }
}
