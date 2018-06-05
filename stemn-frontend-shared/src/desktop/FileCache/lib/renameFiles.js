import fs                   from 'fs'
import pify                 from 'pify'
const fsPromise             = pify(fs)

// This will rename any svf/png files model.svf and model.png to make them easy to access
export default ({ dest }) => fsPromise.readdir(dest).then((files) => {
  // This returns the part folders such as '1', '2' etc
  const renameSvfAndPng = subFolderPath => 
    // Read the contents of the subfolder, this will contain the svf and png
    fsPromise.readdir(subFolderPath).then((files) => {
      const hasModelSvf   = files.includes('model.svf') // We only rename if the file does not already exit
      const hasModelPng   = files.includes('model.png') // We only rename if the file does not already exit
      const filesToRename = files.filter(fileName => (!hasModelSvf && fileName.endsWith('.svf')) || (!hasModelPng && fileName.endsWith('.png')))
      const renameFile = (fileName) => {
        const extension = fileName.substr(fileName.lastIndexOf('.') + 1)
        return fsPromise.rename(`${subFolderPath}/${fileName}`, `${subFolderPath}/model.${extension}`)
      }
      return Promise.all(filesToRename.map(renameFile))
    })
    
  return Promise.all(files.map(folderName => renameSvfAndPng(`${dest}/${folderName}`)))
})
