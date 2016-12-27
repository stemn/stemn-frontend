import './sync-file-select/sync-file-select.js';
import './sync-folder-select/sync-folder-select.js';
import './sync-list-widget/sync-list-widget.js';
import './sync-timeline/timeline.js';
import './sync-service.js';

angular.module('modules.sync', [
    'modules.sync.timeline',
    'modules.sync.list-widget',
    'modules.sync.folder-select',
    'modules.sync.file-select',
    'modules.sync.service',

    'satellizer'
]);
angular.module('modules.sync').

service('SyncUtilService', function ($state, SyncUrlService) {
    var service = this;
    var viewerFileTypes = {
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
            autodesk  : ['3dm','3ds','asm','cam360', 'catpart','cgr','collaboration','dae','dgn','dlv3','dwf','dwfx','dwg','dwt','dxf','exp',
                         'f3d','fbx','g','gbxml','iam','idw','ifc','ige','iges','igs','ipt','jt','model','neu','nwc','nwd','obj','pdf','prt','rcp','rvt',
                         'sab','sat','session','skp','sldprt','smb','smt','ste','step','stl','stla','stlb','stp','wire','x_b','x_t','xas','xpr'],
                        // Assem - 'sldasm' 'catproduct'
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

    var compareModeMap   = ['sideBySide', 'aboveAndBelow', 'onion', 'slider']
    var compareModeTable = {
        gerber   : [0,1,2,3],
        code     : [0,1],
        autodesk : [0,1,2,3],
        google   : [0,1],
        image    : [0,1,2,3],
        pdf      : [0,1],
        pcb      : [0,1,2,3],
        gdoc     : [0,1],
        other    : [0,1]
    }

//    https://docs.google.com/open?id=1HIrHHMWmN2pVeepMT8qf7ESzr74K2KQUvnZo7ryeqY4
    this.getCrumbs      = getCrumbs;
    this.getFileName    = getFileName;
    this.getFileType    = getFileType;
    this.getViewerType  = getViewerType;
    this.getEndingUrl   = getEndingUrl;
    this.openFileFolder = openFileFolder;
    this.isGerber       = isGerber;
    this.processVirtualFiles = processVirtualFiles;
    this.getCompareModes = getCompareModes;

    /////////////////////////////////////////////////////////////////

    function getCompareModes(previewerType1, previewerType2){
        var compareModes1 = compareModeTable[previewerType1];
        var compareModes2 = compareModeTable[previewerType2];
        var compareModes   = compareModes2 ? _.intersection(compareModes1, compareModes2) : compareModes1;
        return _.map(compareModes, function(modeNum){return compareModeMap[modeNum]})
    }

    function getCodeMirrorExts() {
        var codeExts = [];
        _.forEach(window.CodeMirror.modeInfo, function (mode) {
            if (mode.ext) {
                codeExts = codeExts.concat(mode.ext);
            }
        });
        return codeExts
    }

    function getCrumbs(path) {
        if (path) {
            var splitPath = path.split('/');
            // Remove first entry if it is undefined ( when path begins with '/' )
            if (splitPath[0] === '') {
                splitPath.shift();
            }
            var pathTemp = '';
            return _.map(splitPath, function (name, idx) {
                pathTemp = pathTemp ? pathTemp + '/' + name : name;
                return {
                    name: name,
                    path: pathTemp
                }
            })
        }
    }

    function getFileType(path) {
        var pathSplit = path.split('.');
        return pathSplit[pathSplit.length - 1];
    }

    function getFileName(path) {
        var pathSplit = path.split('/');
        return pathSplit[pathSplit.length - 1];
    }

    function getEndingUrl(projectStub, path, revision) {
        var fileUrlEnding = projectStub + '/' + path;
        if (revision) {
            fileUrlEnding = fileUrlEnding + '?revision=' + revision;
        }
        return fileUrlEnding;
    }


    function getViewerType(fileType, provider) {
        var result;
        var fileTypeLower = fileType ? fileType.toLowerCase() : '';
        provider = provider == 'drive' ? 'drive' : 'dropbox';

        // Extend the fileTypes array by the provider specific info
        var viewerFileTypesProvider = _.clone(viewerFileTypes.general);
        _.forEach(viewerFileTypes[provider], function(values, key){
            viewerFileTypesProvider[key] = viewerFileTypesProvider[key] || [];
            viewerFileTypesProvider[key] = viewerFileTypesProvider[key].concat(values);
        })
        _.forEach(viewerFileTypesProvider, function (fileTypes, viewerType) {
            if (fileTypes.indexOf(fileTypeLower) != -1) {
                result = viewerType;
            }
        })
        return result || 'other'
    }

    function isGerber(fileType) {
        var fileTypeLower = fileType ? fileType.toLowerCase() : '';
        return viewerFileTypes.general.gerber.indexOf(fileTypeLower) != -1
    }

    function openFileFolder(file) {
        if (file['.tag'] == 'folder') {
            $state.go('app.project.files', {
                path: file.path,
                stub: file.parentProject
            });
        } else {
            $state.go('app.preview', {
                path: SyncUrlService.getPath(file),
                projectStub: file.parentProject,
                children: file.virtualChildrenMap ? _.map(file.virtualChildren, SyncUrlService.getPath).join(',') : ''
            });
        }
    }

    function processVirtualFiles(files, projectStub, path, folderMeta){
        folderMeta = folderMeta || {};
        var virtualFiles = [];
        // Count the unique gerber file types
        var gerberFileTypes = {};
        var allGerberFiles = {};
        _.forEach(files, function(file){
            if(service.isGerber(file.fileType)){
                allGerberFiles[file.nameRaw] = allGerberFiles[file.nameRaw] || [];
                gerberFileTypes[file.nameRaw] = gerberFileTypes[file.nameRaw] || [];
                if(gerberFileTypes[file.nameRaw].indexOf(file.fileType) == -1){
                    gerberFileTypes[file.nameRaw].push(file.fileType);
                    allGerberFiles[file.nameRaw].push(file);
                }
            }
        })
        _.forEach(allGerberFiles, function(gerberFiles, name){
            // If we have a gerber - create a virtual file.
            if(gerberFiles.length > 3){
                var virtualFile = _.extend({}, folderMeta, {
                    '.tag'   : 'virtual',
                    name     : name+'.gerber',
                    size     : _.sum(gerberFiles, 'size'),
                    fileType : 'gerber',
                    client_modified : _.reduce(gerberFiles, function(prevTime, file){
                        var time = new Date(file.client_modified).getTime();
                        return time > prevTime ? time : prevTime;
                    }, 0),
                    path     : path,
                    virtualChildren : gerberFiles,
                    virtualChildrenMap : _.map(gerberFiles, 'path'),
                    parentProject: projectStub,
                    endingUrl: service.getEndingUrl(projectStub, path),
                    provider : gerberFiles[0].provider,
                })
                virtualFiles.push(virtualFile)
            }
        })

        return virtualFiles
    }
}).

service('SyncUrlService', function ($state) {
    var service = this;
    this.getPath       = getPath;
    this.getChildPath  = getChildPath;
    this.parseChildren = parseChildren;
    this.parsePath     = parsePath;

    /////////////////

    function getPath(meta, head){
        // If head = true - we do not add a specific verion
        if(meta.rev && !head){
            return meta.path+'@'+meta.rev
        }
        else{
            return meta.path
        }
    }

    function getChildPath(children, head){
        // If head = true - we do not add a specific verion
        if(children){
            return _.map(children, function(child){
                 return service.getPath(child, head)
            }).join(',')
        }
    }

    function parseChildren(children){
        if(children){
            var childrenSplit = children.split(',');
            return _.map(childrenSplit, function(child){
                var nameSplit = child.split('@')
                return {
                    path: nameSplit[0],
                    rev : nameSplit[1]
                }
            })
        }
    }
    function parsePath(path){
        var nameSplit = path.split('@');
        return {
            path: nameSplit[0],
            rev : nameSplit[1]
        }
    }

}).

directive('fileThumbnail', function () {
    return {
        restrict: 'E',
        scope: {
            endingUrl: '=?',
            fileType: '=',
            thumbLink: '=?'
        },
        template: require('./tpls/file-thumbnail.html'),
        controller: function ($scope) {
            var imageTypes = ['jpeg', 'png', 'jpg'];
            if (imageTypes.indexOf($scope.fileType) != -1) {
                $scope.isImage = true;
                $scope.thumnailPath = $scope.thumbLink || 'api/v1/sync/thumbnail/' + $scope.endingUrl;
            } else {
                $scope.thumnailPath = '/assets/images/vectors/filetype/' + ($scope.fileType || 'folder') + '.svg'
            }
        }
    };
}).

directive('fileBreadCrumbs', function () {
    return {
        restrict: 'E',
        scope: {
            breadCrumbs: '=',
            project: '=',
            showProjectName: '=',
            selectFn: '=?'
        },
        template: require('./tpls/file-bread-crumbs.html'),
        controller: function ($scope, SyncUtilService) {
            $scope.select = function(item){
                if($scope.selectFn){
                    $scope.selectFn(item)
                }
                else{
                    SyncUtilService.openFileFolder(item);
                }
            }
        }
    };
}).

directive('fileReadme', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            files: '=?', // Either path or files is required
            path: '@?',  // Either path or files is required
            readme: '=',
        },
        template: require('./tpls/file-readme.html'),
        controller: function ($scope, SyncService) {
            $scope.readme = $scope.readme || {};

            if ($scope.files) {
                var found;
                _.forEach($scope.files, function (item) {
                    if (item.name.toLowerCase() == 'readme.md'){
                        found = item;
                    }
                    else if(item.name.toLowerCase() == 'readme.txt' && !found){
                        found = item;
                    }
                })
                
                // If a file is found - get it.
                if (found) {
                    $scope.readme.body = ' ';
                    $scope.readme.loading = true;
                    SyncService.download(found.downloadUrl).then(function (response) {
                        $scope.readme.path = found.path;
                        $scope.readme.loading = false
                        $scope.readme.body = response.data;
                    })
                }
            } else if($scope.path) {
                $scope.readme.body = ' ';
                $scope.readme.loading = true;
                SyncService.download('api/v1/sync/download/' + $scope.project.stub + '/' + $scope.path).then(function (response) {
                    $scope.readme.path = $scope.path;
                    $scope.readme.loading = false
                    $scope.readme.body = response.data;
                })

            }
        }
    };
}).

directive('fileList', function () {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            path: '=',
            selectFn: '=?'
        },
        template: require('./tpls/file-list.html'),
        controller: function ($scope, SyncUtilService, SyncService, $stateParams) {
            $scope.loading = true;
            SyncService.list($scope.project.stub, $scope.path || '').then(function (response) {
                $scope.files = response.data.entries;
                $scope.loading = false;

                var lastType
                _.forEach($scope.files, function (item, idx) {
                    // Check to see if this file is part of current path
                    if ($stateParams.path && $stateParams.path.substring(0, item.path.length) == item.path) {
                        item.isCurrent = true;
                    }
                    // If we transition from files to folders, add a divider
                    lastType = lastType || item['.tag'];
                    if (item['.tag'] != lastType) {
                        // Set the last item to isDivider
                        if ($scope.files[idx - 1]) {
                            $scope.files[idx - 1].isDivider = true;
                        }
                    }
                    lastType = item['.tag'];
                })
            })
            $scope.select = function(item){
                if($scope.selectFn){
                    $scope.selectFn(item)
                }
                else{
                    SyncUtilService.openFileFolder(item);
                }
            }
        }
    };
});
