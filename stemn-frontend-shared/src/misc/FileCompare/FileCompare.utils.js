import { intersection, orderBy, get }   from 'lodash'
import * as CompareIcons  from 'stemn-shared/assets/icons/compare/index.js'

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
  },
]

const iconMap = {
  sideBySide: CompareIcons.SideBySide,
  aboveAndBelow: CompareIcons.TopBottom,
  onion: CompareIcons.OnionSkin,
  slider: CompareIcons.Slide,
  single: CompareIcons.Single,
}

// This table maps the compare modes (above) to the preview mode
const compareModeTable = {
  gerber: [0, 1, 2, 3, 4],
  code: [0, 1, 4],
  autodesk: [0, 1, 2, 3, 4],
  google: [0, 1, 4],
  image: [0, 1, 2, 3, 4],
  pdf: [0, 1, 4],
  pcb: [0, 1, 2, 3, 4],
  gdoc: [0, 1, 4],
  other: [0, 1, 4],
  none: [4],
}

export const getCompareIcon = compareMode => iconMap[compareMode] || CompareIcons.SideBySide

export const getCompareModes = (previewerType1, previewerType2) => {
  const compareModes1 = compareModeTable[previewerType1]
  const compareModes2 = compareModeTable[previewerType2]
  const compareModes  = compareModes2
    ? intersection(compareModes1, compareModes2)
    : compareModeTable.none
  return compareModes.map(modeNum => compareModeInfo[modeNum])
}

export const orderItemsByTime = (mode, item1, item2) => {
  if (mode === 'single' || !item2) {
    return [item1]
  } 
  return orderBy([item1, item2], item => (new Date(item.timestamp)).getTime(), 'desc')
}

export const isSelected = ({ item, selected1, selected2, mode }) => {
  const isSelected1 = get(selected1, 'data.revisionId', undefined) === item.data.revisionId
  const isSelected2 = get(selected2, 'data.revisionId', undefined) === item.data.revisionId
  return mode === 'single'
    ? isSelected1
    : isSelected1 || isSelected2
}
