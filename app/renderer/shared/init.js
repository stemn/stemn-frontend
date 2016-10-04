import moment from 'moment';
import 'moment/locale/en-gb';
import 'app/renderer/assets/css/app.global.css';
import http from 'axios';

moment.locale('en-gb');
http.defaults.baseURL = 'https://localhost:3000/';

console.log(process.env);
