const invokeGetters = (initObject, newObject) => {
  const invokedObject = newObject || {};
  Object.keys(initObject).forEach(function (key) {
    if(initObject[key] !== null && typeof initObject[key] == 'object'){
      if(Array.isArray(initObject[key])){
        invokedObject[key] = invokedObject[key] || []
      }
      else{
        invokedObject[key] = invokedObject[key] || {}
      }
      return invokeGetters(initObject[key], invokedObject[key])
    }
    else{
      invokedObject[key] = initObject[key];
    }
  })
  return invokedObject
}

export default invokeGetters;
