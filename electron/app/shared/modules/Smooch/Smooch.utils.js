import Smooch from 'smooch';
import { appToken } from './Smooch.config.js';
import classes from './Smooch.css';


export const init = () => {
  Smooch.init({appToken: appToken});
}
