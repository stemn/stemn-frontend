import { intersection, orderBy, get } from 'lodash'
import * as CompareIcons from 'stemn-shared/assets/icons/compare/index.js'
import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils'

const compareModeInfo = [
  // Compare modes and text
  {
    value: 'sideBySide',
    text: 'Side By Side',
  },
  {
    value: 'aboveAndBelow',
    text: 'Above and Below',
  },
  {
    value: 'onion',
    text: 'Onion Skin',
  },
  {
    value: 'slider',
    text: 'Slider',
  },
  {
    value: 'single',
    text: 'None',
  },
  {
    value: 'unified',
    text: 'Unified Diff',
  },
]

const iconMap = {
  sideBySide: CompareIcons.SideBySide,
  aboveAndBelow: CompareIcons.TopBottom,
  onion: CompareIcons.OnionSkin,
  slider: CompareIcons.Slide,
  single: CompareIcons.Single,
  unified: CompareIcons.Unified,
}

// This table maps the compare modes (above) to the preview mode
const compareModeTable = {
  gerber: [0, 1, 2, 3, 4],
  code: [0, 1, 4],
  // G-code: the unified diff of the layers (FileDiff, the toolpath view), or side by side
  gcode: [5, 0, 1, 4],
  // CAD: the unified diff (FileDiff) for the formats the API diffs, the rest fall back to side by side there
  autodesk: [5, 0, 1, 2, 3, 4],
  google: [0, 1, 4],
  image: [0, 1, 2, 3, 4],
  pdf: [0, 1, 4],
  // PCB and electronics: the unified diff (PcbDiffView) for what the API's PCB converter reads
  pcb: [5, 0, 1, 2, 3, 4],
  gdoc: [0, 1, 4],
  other: [0, 1, 4],
  none: [4],
}

export const getCompareIcon = (compareMode) => iconMap[compareMode] || CompareIcons.SideBySide

export const getCompareModes = (previewerType1, previewerType2) => {
  const compareModes1 = compareModeTable[previewerType1]
  const compareModes2 = compareModeTable[previewerType2]
  const compareModes = compareModes2 ? intersection(compareModes1, compareModes2) : compareModeTable.none
  return compareModes.map((modeNum) => compareModeInfo[modeNum])
}

// CAD files (the 'autodesk' viewer type, whichever provider converts them) compare in the diff viewer
export const isCadFile = (file) => Boolean(file && file.name) && getViewerType(file.name, file.provider) === 'autodesk'

// PCB and electronics files (the 'pcb' viewer type: KiCad, Eagle, Gerber, Excellon) compare in the 2D diff viewer
export const isPcbFile = (file) => Boolean(file && file.name) && getViewerType(file.name, file.provider) === 'pcb'

// G-code compares in the layer diff viewer
export const isGcodeFile = (file) => Boolean(file && file.name) && getViewerType(file.name, file.provider) === 'gcode'

// the files the diff viewers compare: CAD files, PCB and electronics files and G-code toolpaths
export const isDiffableFile = (file) => isCadFile(file) || isPcbFile(file) || isGcodeFile(file)

export const orderItemsByTime = (mode, item1, item2) => {
  if (mode === 'single' || !item2) {
    return [item1]
  }
  return orderBy([item1, item2], (item) => new Date(item.timestamp).getTime(), 'desc')
}

export const isSelected = ({ item, selected1, selected2, mode }) => {
  const isSelected1 = get(selected1, 'data.revisionId', undefined) === item.data.revisionId
  const isSelected2 = get(selected2, 'data.revisionId', undefined) === item.data.revisionId
  return mode === 'single' ? isSelected1 : isSelected1 || isSelected2
}
