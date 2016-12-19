///* eslint-disable no-param-reassign */
///* eslint-disable no-unused-vars */
//import assert from 'assert';
//import { aliases as authAliases } from '../../actions/auth';
//import { aliases as sidebarAliases } from '../../actions/sidebar';
//import { aliases as loginAliases } from '../../actions/login';
//
//const aliases = {
//  ...authAliases,
//  ...sidebarAliases,
//  ...loginAliases,
//};
//
//const triggerAlias = store => next => action => {
//  console.log('ACTION => ' + action.type + (action.meta && action.meta.trigger ? ' ('+action.meta.trigger+')' : ''));
//  // TODO: store.dispatch() instead to not skip any middleware
//  if (action.type === 'ALIASED') {
//    assert(action.meta && action.meta.trigger, 'No trigger defined');
//    assert(aliases[action.meta.trigger], 'Trigger alias ' +action.meta.trigger + ' not found');
//
//    // trigger alias
//    return store.dispatch(aliases[action.meta.trigger](action.payload))
//  }
//  return next(action);
//};
//
//export default triggerAlias;
