import { forEach, clone } from 'lodash';
import codemirror from 'codemirror';
import 'codemirror/mode/meta.js';

const getCodeMirrorExts = () => {
    var codeExts = [];
    forEach(codemirror.modeInfo, function (mode) {
        if (mode.ext) {
            codeExts = codeExts.concat(mode.ext);
        }
    });
    return codeExts
}

export const viewerFileTypes = {
    general       : {
        gerber   : ['gerber', // Virtual gerber type
                    'drl', 'drd', 'txt', // This goes first so txt does not display as gerber
                    'out', 'outline',
                    'gbl', 'sol',
                    'gbs', 'sts',
                    'gbp', 'crs',
                    'gbo', 'pls',
                    'gtl', 'cmp',
                    'gts', 'stc',
                    'gtp', 'crc',
                    'gto', 'plc'],
        pcb       : ['brd', 'pcb', 'kicad_pcb'],
        code      : getCodeMirrorExts(),
        autodesk  : ['3dm','3ds','asm','cam360', 'catpart','catproduct','cgr','collaboration','dae','dgn','dlv3','dwf','dwfx','dwg','dwt','dxf','exp',
                     'f3d','fbx','g','gbxml','iam','idw','ifc','ige','iges','igs','ipt','jt','model','neu','nwc','nwd','obj','pdf','prt','rcp','rvt',
                     'sab','sat','session','skp','sldasm','sldprt','smb','smt','ste','step','stl','stla','stlb','stp','wire','x_b','x_t','xas','xpr'],
        google    : ['webm', 'mpeg4', '3gpp', 'mov', 'avi', 'mpegps', 'wmv', 'flv', //https://gist.github.com/izazueta/4961650
                    'xls', 'xlsx',
                    'pages',
                    'psd', 'tiff',
                    'eps', 'ps', 'ai',
                    'ttf', 'xps',
                   ],
        image    : ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'ico'],
        pdf      : ['pdf',
                   ],
//            pcb      : ['brd', 'pcb', 'kicad_pcb'],
    },
    dropbox      : {
        pdf      : ['docx', 'doc', 'docm',
                    'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm',
                    'rtf']
    },
    drive        : {
        google   : ['docx', 'doc', 'docm',
                    'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm',
                    'rtf'],
        gdoc     : ['gdoc', 'gsheet', 'gslides']
    }
}

export const getViewerType = (fileType, provider) => {
    var result;
    var fileTypeLower = fileType ? fileType.toLowerCase() : '';
    provider = provider == 'drive' ? 'drive' : 'dropbox';

    // Extend the fileTypes array by the provider specific info
    var viewerFileTypesProvider = clone(viewerFileTypes.general);
    Object.keys(viewerFileTypes[provider]).forEach( key => {
      viewerFileTypesProvider[key] = viewerFileTypesProvider[key] || [];
      viewerFileTypesProvider[key] = viewerFileTypesProvider[key].concat(viewerFileTypes[key]);
    })

    Object.keys(viewerFileTypesProvider).forEach(viewerType => {
      if (viewerFileTypesProvider[viewerType].indexOf(fileTypeLower) != -1) {
        result = viewerType;
      }
    })
    return fileTypeLower ? (result || 'other') : 'code'; // If there is no esxtension, it is code.
}
