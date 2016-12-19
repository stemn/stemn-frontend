import {sampleSize} from 'lodash';

export default () => {
  var possible = 'abcdef0123456789abcdef0123456789';
  return sampleSize(possible, 24).join('');
};
