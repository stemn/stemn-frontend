export function create({ type, props }) {
  return {
    type: 'ELECTRON_WINDOWS/CREATE',
    aliased: true,
    payload: {
      functionAlias: 'ElectronWindowsUtils.create',
      functionInputs: { type, props },
    },
  }
}

export function show(window) {
  return {
    type: 'ELECTRON_WINDOWS/SHOW',
    aliased: true,
    payload: {
      functionAlias: 'ElectronWindowsUtils.show',
      functionInputs: { window },
    },
  }
}

export function hide(window) {
  return {
    type: 'ELECTRON_WINDOWS/HIDE',
    aliased: true,
    payload: {
      functionAlias: 'ElectronWindowsUtils.hide',
      functionInputs: { window },
    },
  }
}

export function quit() {
  return {
    type: 'ELECTRON_WINDOWS/QUIT',
    aliased: true,
    payload: {
      functionAlias: 'ElectronWindowsUtils.quit',
    },
  }
}

export function relaunch() {
  return {
    type: 'ELECTRON_WINDOWS/RELAUNCH',
    aliased: true,
    payload: {
      functionAlias: 'ElectronWindowsUtils.relaunch',
    },
  }
}
