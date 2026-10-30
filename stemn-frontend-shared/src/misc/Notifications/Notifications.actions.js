// The notifications list and mark-as-read are TanStack Query hooks: stemn-shared/api/queries/notifications

/** Desktop: shows a native notification (runs in the main process through the FunctionLibrary) */
export const show = ({ type, title, body }) => ({
  type: 'NOTIFICATIONS/SHOW',
  payload: {
    functionAlias: 'NotificationsUtils.show',
    functionInputs: {
      title,
      body,
    },
  },
})
