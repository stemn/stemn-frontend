import { sendAuthToken } from '../../shared/actions/auth.js';

export const authGoogle = (req, res) => {
  console.log(req.query);
  req.store.dispatch(sendAuthToken({
    url: '',
    code: ''
  }));
}

export const authDropbox = (req, res) => {
  console.log(req.query);
  req.store.dispatch(sendAuthToken({
    url: '',
    code: ''
  }));
}

export const authFacebook = (req, res) => {
  console.log(req.query);
  req.store.dispatch(sendAuthToken({
    url: '',
    code: ''
  }));
}

export const authLinkedin = (req, res) => {
  console.log(req.query);
  req.store.dispatch(sendAuthToken({
    url: '',
    code: ''
  }));
}
