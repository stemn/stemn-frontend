import { readdir, rename } from 'node:fs/promises'

// This will rename any svf/png files model.svf and model.png to make them easy to access
export default ({ dest }) =>
  readdir(dest).then((files) => {
    // This returns the part folders such as '1', '2' etc
    const renameSvfAndPng = (subFolderPath) =>
      // Read the contents of the subfolder, this will contain the svf and png
      readdir(subFolderPath).then((subFiles) => {
        const hasModelSvf = subFiles.includes('model.svf') // We only rename if the file does not already exist
        const hasModelPng = subFiles.includes('model.png')
        const filesToRename = subFiles.filter(
          (fileName) => (!hasModelSvf && fileName.endsWith('.svf')) || (!hasModelPng && fileName.endsWith('.png')),
        )
        const renameFile = (fileName) => {
          const extension = fileName.substr(fileName.lastIndexOf('.') + 1)
          return rename(`${subFolderPath}/${fileName}`, `${subFolderPath}/model.${extension}`)
        }
        return Promise.all(filesToRename.map(renameFile))
      })

    return Promise.all(files.map((folderName) => renameSvfAndPng(`${dest}/${folderName}`)))
  })
