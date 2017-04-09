const rootDomain = GLOBAL_ENV.APP_TYPE === 'web'
  ? window.location.origin
  : 'http://localhost:49554';


export const oauthCreds = {
  facebook: {
    url                   : 'https://www.facebook.com/dialog/oauth',
    postUrl               : `/api/v1/auth/facebook`,
    params                : {
      redirect_uri        : `${rootDomain}/api/auth/facebook`,
      client_id           : '710281375734499',
    },
  },
  google: {
    url                   : 'https://accounts.google.com/o/oauth2/v2/auth',
    postUrl               : `/api/v1/auth/google`,
    params                : {
      access_type         : 'offline',
      redirect_uri        : `${rootDomain}/api/auth/google`,
      response_type       : 'code',
      prompt              : 'consent', // forces request of refresh token
      client_id           : '502305750839-8m9aian8ka9qb6j64t3dtjs2nq96tdae.apps.googleusercontent.com',
      scope               : 'openid profile email https://www.googleapis.com/auth/drive',
    },
  },
  linkedin: {
    url                   : 'https://www.linkedin.com/oauth/v2/authorization',
    postUrl               : `/api/v1/auth/linkedin`,
    params                : {
      response_type       : 'code',
      redirect_uri        : `${rootDomain}/api/auth/linkedin`,
      client_id           : '75gm1u1gda1xoe',
      scope               : ['r_fullprofile', 'r_emailaddress'],
    },
  },
  dropbox: {
    url                   : 'https://www.dropbox.com/oauth2/authorize',
    postUrl               : `/api/v1/auth/dropbox`,
    params                : {
      force_reapprove     : true,
      redirect_uri        : `${rootDomain}/api/auth/dropbox`,
      response_type       : 'code',
      client_id           : '0wgo11dn573805b'
    },
  }
}
