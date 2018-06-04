export function enable() {
  return {
    type: 'SHELL_CONTEXT/ENABLE',
    aliased: true,
    payload: {
      functionAlias: 'ShellContextUtils.enable',
    },
  }
}
export function disable() {
  return {
    type: 'SHELL_CONTEXT/DISABLE',
    aliased: true,
    payload: {
      functionAlias: 'ShellContextUtils.disable',
    },
  }
}
export function isEnabled() {
  return {
    type: 'SHELL_CONTEXT/IS_ENABLED',
    aliased: true,
    payload: {
      functionAlias: 'ShellContextUtils.isEnabled',
    },
  }
}
export function updateConfig(config) {
  return {
    type: 'SHELL_CONTEXT/UPDATE_CONFIG',
    aliased: true,
    payload: {
      functionAlias: 'ShellContextUtils.updateConfig',
      functionInputs: config,
    },
  }
}
