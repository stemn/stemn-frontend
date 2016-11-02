import { app } from 'electron';

export const create = () => {
  console.log('create window');
}
export const hide = () => {
  console.log('hide window');
}
export const show = (window) => {
  console.log('show window', window);
}
export const quit = () => {
  app.quit();
}