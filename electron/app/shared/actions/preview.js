export const TOGGLE_PREVIEW = 'PREVIEW/TOGGLE_PREVIEW';

export function togglePreview(status) {
  return {
    type: TOGGLE_PREVIEW,
    payload: status // If status exists, we set, otherwise we toggle
  };
}
