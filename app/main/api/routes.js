export const authGoogle = (req, res) => {
  console.log(req.query);
  req.store.dispatch({ type : 'auth/google', payload : req.query });
}

export const authDropbox = (req, res) => {
  console.log(req.query);
  req.store.dispatch({ type : 'auth/dropbox', payload : req.query });
}

export const authFacebook = (req, res) => {
  console.log(req.query);
  req.store.dispatch({ type : 'auth/facebook', payload : req.query });
}
