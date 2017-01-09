import fs                   from 'fs';
import pify                 from 'pify';
const fsPromise             = pify(fs);

// This will rename any svf/png files model.svf and model.png to make them easy to access
export default ({dest}) => {
  return fsPromise.readdir(dest).then(files => {
    // This returns the part folders such as '1', '2' etc
    const renameSvfAndPng = (subFolderPath) => {
      // Read the contents of the subfolder, this will contain the svf and png
      return fsPromise.readdir(subFolderPath).then(files => {
        const filesToRename = files.filter(fileName => fileName.endsWith('.svf') || fileName.endsWith('.png'));
        const renameFile = (fileName) => {
          const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
          return fsPromise.rename(`${subFolderPath}/${fileName}`, `${subFolderPath}/model.${extension}`)
        }
        return Promise.all(filesToRename.map(renameFile))
      })
    }
    return Promise.all(files.map(folderName => renameSvfAndPng(`${dest}/${folderName}`)));
  })
}
