// Vite (desktop): same lookup function as fileTypeIcons.js (webpack's require.context)
const icons = import.meta.glob('../filetype/*.svg', { eager: true, import: 'default', query: '?url' })

export default (request) => {
  const url = icons[`../filetype/${request.replace(/^\.\//, '')}`]
  if (!url) throw new Error(`Cannot find file type icon ${request}`)
  return url
}
