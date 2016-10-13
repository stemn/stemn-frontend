import { remote } from 'electron';
import { oauthCreds } from './auth.config.js';
import querystring from 'querystring';
import http from 'axios';
import { Promise } from 'es6-promise';

// Init the Auth Window
let window = null;

export const getWindow = () => {
  if(!window){
    window = new remote.BrowserWindow({
      show: false,
      width: 800,
      height: 850,
    });
    window.setMenu(null);
    window.setAlwaysOnTop(true);
    window.setResizable(false);
    window.on('closed', () => {
      window = null;
    });
  }
  return window
}

export const authenticate = ({provider}) => {
  let authHttpPromise = null;

  return new Promise((resolve, reject) => {
    // If the provider is supported
    if(oauthCreds[provider]){
      const url = oauthCreds[provider].url +'?'+ querystring.stringify(oauthCreds[provider].params);
      const window = getWindow();

      window.loadURL(url);
      window.webContents.on('did-finish-load', () => {
        window.show();
        window.focus();
      });

      // Process the url if it changes - check for access token
      window.webContents.on('will-navigate', function (event, url) {
        processToken(url);
      });
      window.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        processToken(newUrl);
      });

      window.on('closed', () => {
        if(!authHttpPromise){
          reject({error: 'Window Closed'})
        }
      });

      const processToken = (url) => {
        console.log(url);
         const params = provider == 'dropbox' ? querystring.parse(url.split('#')[1]) : querystring.parse(url.split('?')[1]);
        console.log(params);
         if (params.access_token || params.code) {
          authHttpPromise = http({
            method: 'POST',
            url: oauthCreds[provider].postUrl,
            data: {
              code: params.code || params.access_token,
              redirectUri: oauthCreds[provider].params.redirect_uri
            }
          })
          .then(resolve)
          .catch(reject);

          window.close();
        } else {
          window.close();
          reject({error: 'Could not find token'})
        }
      }
    }
    else{
      reject({error: 'Unsupported Type'})
    }
  });
}
