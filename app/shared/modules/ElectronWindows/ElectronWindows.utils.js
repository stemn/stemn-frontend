import { app } from 'electron';
import { windows } from '../../../main/index.js';
import { create as createPreview } from '../../../main/createPreviewWindow.js';
import querystring from 'querystring';

export const create = ({type, props}) => {
  console.log('create window');
  if(type == 'PREVIEW'){
//    const { projectId, fileId, revisionId } = props;
//    console.log('QUERY:');
//    console.log();
////    createPreview({uri: `/preview/${projectId}/${fileId}/${revisionId}`});
//    Stringify the props and pass them as query params
    const queryParams = querystring.stringify(props);
    console.log(queryParams);
    console.log(props);
    createPreview({uri: queryParams ? `?${queryParams}` : ''});
  }
  else{
    console.error('Window could not be created');
  }
}

export const hide = ({window}) => {
  if(windows[window]){
    windows[window].browserWindow.hide();
  }
  else{
    console.error('Window could not be found');
  }
}

export const show = ({window}) => {
  if(windows[window]){
    windows[window].show();
  }
  else{
    console.error('Window could not be found');
  }
}

export const quit = () => {
  app.quit();
}


