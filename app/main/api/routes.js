export const authGoogle = (req, res) => {
  console.log(req.query);
  req.store.dispatch({ type : 'auth/google', payload : req.query });
}
