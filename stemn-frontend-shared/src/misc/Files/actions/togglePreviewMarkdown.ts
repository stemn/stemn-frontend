// Note: no reducer handles USER_SETTINGS/TOGGLE_PREVIEW_MARKDOWN; the Files reducer toggles `previewMarkdown` on
// FILES/TOGGLE_PREVIEW_MARKDOWN, which nothing dispatches (pre-existing, kept as is).
export const togglePreviewMarkdown = () => ({
  type: 'USER_SETTINGS/TOGGLE_PREVIEW_MARKDOWN' as const,
  payload: {},
})
