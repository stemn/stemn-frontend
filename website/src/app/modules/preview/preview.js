import './preview-cad/preview-cad.js';
import './preview-code/preview-code.js';
import './preview-embed/preview-embed.js';
import './preview-files/preview-files.js';
import './preview-gerber/preview-gerber.js';
import './preview-pcb/preview-pcb.js';
import './preview-pdf/preview-pdf.js';

angular.module('modules.preview', [
    'modules.preview.cad',
    'modules.preview.code',
    'modules.preview.files',
    'modules.preview.gerber',
    'modules.preview.pcb',
    'modules.preview.embed',
    'modules.preview.pdf'
]);
angular.module('modules.preview');
