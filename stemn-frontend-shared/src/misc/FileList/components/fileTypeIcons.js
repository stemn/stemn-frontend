// Every svg in ../filetype as a url, looked up with fileTypeIcons('./<type>.svg').
// The webpack fallback build resolves fileTypeIcons.webpack.js (require.context) instead.
const icons = import.meta.glob('../filetype/*.svg', { eager: true, import: 'default', query: '?url' })

export default (request) => {
  const url = icons[`../filetype/${request.replace(/^\.\//, '')}`]
  if (!url) throw new Error(`Cannot find file type icon ${request}`)
  return url
}
