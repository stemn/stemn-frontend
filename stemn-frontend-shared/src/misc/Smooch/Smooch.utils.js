import Smooch from 'smooch'
import { appToken } from './Smooch.config.js'


export const init = () => {
  Smooch.init({ appToken })
}
