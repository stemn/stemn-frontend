import getUuid from '../../../../shared/helpers/getUuid.js';

export function show({type, title, options, actions}) {
  console.log(actions);
  return {
    type: 'TOAST/SHOW',
    payload: {
      id: getUuid(),
      type, // 'error' || default
      title,
      options,
      actions
      /*************************
      actions: [
        {
          text: 'Undo',
          action: reduxAction
        }
      ]
      *************************/

    },
  };
}

export function hide({id}){
  return {
    type: 'TOAST/HIDE',
    payload: {
      id,
    },
  };
}
