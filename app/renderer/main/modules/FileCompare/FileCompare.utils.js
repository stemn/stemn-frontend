import {intersection} from 'lodash';

const compareModeInfo = [ // Compare modes and text
  {
    value: 'sideBySide',
    text: 'Side By Side',
  }, {
    value: 'aboveAndBelow',
    text: 'Above and Below',
  }, {
    value: 'onion',
    text: 'Onion Skin',
  }, {
    value: 'slider',
    text: 'Slider',
  }, {
    value: 'single',
    text: 'None',
  }
]

// This table maps the compare modes (above) to the preview mode
const compareModeTable = {
    gerber   : [0,1,2,3,4],
    code     : [0,1,4],
    autodesk : [0,1,2,3,4],
    google   : [0,1,4],
    image    : [0,1,2,3,4],
    pdf      : [0,1,4],
    pcb      : [0,1,2,3,4],
    gdoc     : [0,1,4],
    other    : [0,1,4]
}

export const getCompareModes = (previewerType1, previewerType2) => {
  const compareModes1 = compareModeTable[previewerType1];
  const compareModes2 = compareModeTable[previewerType2];
  const compareModes  = compareModes2 ? intersection(compareModes1, compareModes2) : compareModes1;
  return compareModes.map((modeNum)=>compareModeInfo[modeNum])
}
