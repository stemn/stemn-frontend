import * as AuthActions from '../../../../shared/actions/auth.js';

export const updateGoober = (payload) =>{
  // Do some stuff
  console.log(payload);

  // Return a redux event
  return AuthActions.login({
    asffsa: 'asffsa',
    asffsa1: 'asffsa',
    asffsa2: 'asffsa',
  })
}
