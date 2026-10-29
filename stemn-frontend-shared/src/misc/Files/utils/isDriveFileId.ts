/** Google Drive ids are opaque; Dropbox ids start with `id:` */
export default (id: string | null | undefined) => id && !id.startsWith('id:')
