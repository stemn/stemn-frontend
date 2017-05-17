export default ({ user }) => ({
  type: 'AUTH/UPDATE_USER',
  payload: {
    user,
  },
})
