import http from 'axios';

http.defaults.baseURL = `https://${process.env.API_SERVER}/`;
