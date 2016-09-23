import Promise from 'bluebird';
import getUuid from '../helpers/getUuid.js';


const cache = {

}

export const newPromise() => {
  cache[getUuid()] = new Promise;
}

export const getPromise(promiseId) => {
  if(cache[promiseId]){
    return cache[promiseId]
  }
  else{
    console.log(`Promise: ${promiseId} could not be found.`);
  }
}
