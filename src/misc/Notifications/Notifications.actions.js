export function show({type, title, body}) {
  return {
    type: 'NOTIFICATIONS/SHOW',
    payload: {
      functionAlias: 'NotificationsUtils.show',
      functionInputs: {
        title, body
      }
    }
  }
}
