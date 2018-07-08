export function init({ storeKey, path }) {
  return {
    type: 'FILE_SELECT/INIT',
    payload: {
      path,
    },
    meta: {
      storeKey,
    },
  }
}

export function select({ storeKey, file }) {
  return {
    type: 'FILE_SELECT/SELECT',
    payload: {
      file,
    },
    meta: {
      storeKey,
    },
  }
}

export function deselect({ storeKey }) {
  return {
    type: 'FILE_SELECT/DESELECT',
    payload: {},
    meta: {
      storeKey,
    },
  }
}

export function changePath({ storeKey, path }) {
  return {
    type: 'FILE_SELECT/CHANGE_PATH',
    payload: {
      path,
    },
    meta: {
      storeKey,
    },
  }
}
