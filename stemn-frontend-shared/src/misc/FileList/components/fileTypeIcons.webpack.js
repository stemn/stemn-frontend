// webpack fallback build only (resolve.extensions tries `.webpack.js` first):
// the same lookup as fileTypeIcons.js, with require.context instead of import.meta.glob
export default require.context('../filetype', true)
