angular.module('modules.sync.service', [
]);
angular.module('modules.sync.service').

service('SyncService', function ($http, SyncUtilService,  $q) {
    var service = this;

    this.list = list;
    this.getPath = getPath;                          // function(projectStub, path)
    this.download = download;
    this.render = render;
    this.metadata = metadata;
    this.metadataVirtual = metadataVirtual;
    this.search = search;
    this.revisions = revisions;
    this.revisionsDeep = revisionsDeep;
    this.remove = remove;
    this.createFolder = createFolder;
    this.upload = upload;
    this.folderMembers = folderMembers;
    this.ownerInfo = ownerInfo;
    this.fileStats = fileStats;
    this.explorePrivate = explorePrivate;       // function(provider, path)



    var pathCache = {}
    //////////////////////////////////

    function list(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/listFolder/' + project + '/' + path
        }).then(function (response) {
            if(response.data.files){ // If Google
                response.data.entries = _.map(response.data.files, function(item){
                    return processDrive(item, project)
                })

            }else{
                response.data.entries = _.map(response.data.entries, function (item) {
                    return processDropbox(item, project)
                })
            }
            var virtualFiles = SyncUtilService.processVirtualFiles(response.data.entries, project, path);
            response.data.entries = response.data.entries.concat(virtualFiles);
            response.data.entries = _.sortByOrder(response.data.entries, ['.tag', 'client_modified'], ['desc', 'desc']);
            return response
        })
    }

    // Gets the full path of a file/folder because Google Sucks!

    function getPath(filePath, projectStub, rootId, absolute){
        var deferred = $q.defer();
        var requestFn = (projectStub && !absolute) ? getPathRelative : getPathAbsolute;
        var endpoint  = (projectStub && !absolute) ? 'sync-path-' + projectStub : 'sync-path-' + projectStub + 'abs';

        console.log(filePath);
        // Save the current folder details to the cache
        $q.all(checkCache(filePath)).then(function(response){
            var results = [];
            _.forEachRight(response, function(item1){
                if(item1.constructor === Array){
                    _.forEach(item1, function(item2){
                        item2.path = item2.id;
                        results.push(item2)
                    })
                }
                else{
                    item1.path = item1.id;
                    results.push(item1)
                }
            })
            deferred.resolve(results);
        })
        return deferred.promise;


        ////////////////////
        function checkCache(folderId, resultArray){
            // Default the results
            resultArray = resultArray || [];
            // Default the cache
            pathCache[endpoint] = pathCache[endpoint] || {};

            var folderInfo = pathCache[endpoint][folderId];
            console.log(folderInfo);

            if(folderInfo){ // We have an entry in the cache
                if(folderInfo.parent && folderInfo.path && folderInfo.id != rootId){ // If it has a parent and it is not the root directory
                    resultArray.push(folderInfo);
                    return checkCache(folderInfo.parent, resultArray) // This will return resultArray
                }
                else{ // Else, it is a promise
                    resultArray.push(folderInfo);
                    return resultArray
                }
            }
            else{
                pathCache[endpoint][folderId] = requestFn(folderId).then(function(response){
                    _.forEach(response.data[0], function(folder){
                        cacheSave(endpoint, folder);
                    })
                    return response.data[0]
                })
                return resultArray.concat(pathCache[endpoint][folderId])
            }
        }

        function getPathRelative(folderId){
            return $http({
                url: '/api/v1/sync/path/' + projectStub +'/',
                method: "GET",
                params: {
                    'folderId[]': folderId,
                }
            })
        }
        function getPathAbsolute(folderId){
            return $http({
                url: '/api/v1/sync/path/' + projectStub +'/',
                method: "GET",
                params: {
                    'folderId[]': folderId,
                    absolute: true
                }
            })
        }
    }

    function cacheSave(endpoint, item){
        pathCache[endpoint] = pathCache[endpoint] || {};
        pathCache[endpoint][item.id] = item;
    }

    function download(downloadUrl) {
        var splitUrl = downloadUrl.split('@');
        return $http({
            method: 'GET',
            url: splitUrl[0],
            params: {
                revision: splitUrl[1]
            }
        })
    }

    function metadata(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/metadata/' + project + '/' + path,
            params: params
        }).then(function (response) {
            if(response.data.mimeType){ // If google
                response.data = processDrive(response.data, project)
            }
            else{
                response.data = processDropbox(response.data, project)
            }
            return response
        })
    }

    function metadataVirtual(projectStub, pathMeta, children) {
        if(children){
            var promiseMap = [service.metadata(projectStub, pathMeta.path).then(function(response){
                return response.data;
            })];
            promiseMap = promiseMap.concat(_.map(children, function(childMeta){
                return service.metadata(projectStub, childMeta.path, {revision:childMeta.rev}).then(function(response){
                    return response.data;
                })
            }))
            return $q.all(promiseMap).then(function(response){
                var folderMeta = response[0];
                response.shift();
                return SyncUtilService.processVirtualFiles(response, projectStub, pathMeta.path, folderMeta)[0];
            })

        }
        else{
            return service.metadata(projectStub, pathMeta.path, {revision:pathMeta.rev}).then(function(response){
                return response.data;
            })
        }
    }

    function render(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/render/' + project + '/' + path,
            params: params
        })
    }

    function revisions(projectStub, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/revisions/' + projectStub + '/' + path,
        }).then(function (response) {
            var results;
            if(response.data.kind == 'drive#revisionList'){// Drive
                results = _.map(response.data.revisions, function(revision, idx){
                    return {
                        revDecimal: idx + 1,
                        client_modified: revision.modifiedTime,
                        rev: revision.id,
                        endingUrl: SyncUtilService.getEndingUrl(projectStub, path, revision.id)
                    }
                })
            }
            else{ // Dropbox
                results = _.forEach(response.data.entries, function (item, idx) {
                    processDropbox(item, projectStub);
                    item.revDecimal = response.data.entries.length - idx;
                    return item;
                })
                results.reverse();

            }
            return results
        })
    }

    function revisionsDeep(meta) {
        if(meta.virtualChildren){
            // Get child versions
            var promiseMap = _.map(meta.virtualChildren, function(child){
                return service.revisions(meta.parentProject, child.path).then(function(response){
                    child.revisions = response;
                    return child
                })
            })
            return $q.all(promiseMap).then(function(response){
                meta.virtualChildren = response;


                // Get the unique periods
                var uniquePeriods = []
                _.forEach(meta.virtualChildren, function(child){
                    _.forEach(child.revisions, function(revision){
                        var time = new Date(revision.client_modified).getTime();
                        if(uniquePeriods.indexOf(time) == -1){
                            uniquePeriods.push(time);
                        }
                    })
                })

                // Order the unique periods
                uniquePeriods = uniquePeriods.sort();

                // Construct the parent revision timeline - unique periods must me in order
                var parentVersions = [];
                _.forEach(uniquePeriods, function(period, index){
                    if(!parentVersions[index]){
                        parentVersions[index] = {
                            name: meta.name,
                            path: meta.path,
                            client_modified : moment(period).format(),
                            revDecimal: index + 1,
                            virtualChildren : [],
                            virtualChildrenRevs : [],
                            rev: index + 1
                        }
                    }
                    _.forEach(meta.virtualChildren, function(child){
                        // Find the last child that existed at the period in question
                        var lastChild = _.findLast(child.revisions, function(revision){
                            var time = new Date(revision.client_modified).getTime();
                            return time <= period
                        })
                        parentVersions[index].virtualChildren.push(lastChild)
                        parentVersions[index].virtualChildrenRevs.push(lastChild.rev)
                    })
                })
                meta.revisions = parentVersions

                // Finally, check to see what version we are on currently
                var actualRevs = _.map(meta.virtualChildren, 'rev');
                var metaExtra = _.find(meta.revisions, function(revision){
                    return _.difference(revision.virtualChildrenRevs, actualRevs).length === 0;
                })
                if(metaExtra){
                    meta.revDecimal = metaExtra.revDecimal;
                    meta.rev        = metaExtra.rev;
                }
                return meta
            })
        }
        else{
            return service.revisions(meta.parentProject, meta.path).then(function(response){
                meta.revisions = response;
                var metaExtra = _.find(meta.revisions, 'rev', meta.rev);
                if(metaExtra){
                    meta.revDecimal = metaExtra.revDecimal;
                }
                return meta
            })
        }
    }

    function remove(project, path) {
        return $http({
            method: 'DELETE',
            url: '/api/v1/sync/delete/' + project + '/' + path,
        })
    }

    function createFolder(project, path) {
        return $http({
            method: 'POST',
            url: '/api/v1/sync/createFolder/' + project + '/' + path,
        })
    }

    function upload(project, path, params, data) {
        return $http({
            method: 'POST',
            url: '/api/v1/sync/upload/' + project + '/' + path,
            params: {
                revision: params.revision
            },
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            data: data
        })
    }

    function spaceUsage(project) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/spaceUsage/' + project
        })
    }

    function search(project, path, params) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/search/' + project + '/' + path,
            params: params
        }).then(function (response) {
            if(response.data.files){ // If Google
                response.data.matches = _.map(response.data.files, function(item){
                    console.log(item);
                    return processDrive(item, project)
                })

            }else{
                response.data.matches = _.map(response.data.matches, function (item) {
                    return processDropbox(item.metadata, project)
                })
            }
            return response
        })
    }

    function folderMembers(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/folderMembers/' + project + '/' + path,
        })
    }

    function ownerInfo(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/ownerInfo/' + project + '/' + path
        }).then(function(response){
            var result = {};
            if(response.data.name.display_name){ // Dropbox
                result.email       = response.data.email;
                result.name        = response.data.name.display_name;
                result.given_name  = response.data.name.given_name
                result.family_name = response.data.name.surname;
            }
            else{ // Google
                result.email       = response.data.email;
                result.name        = response.data.name;
                result.given_name  = response.data.given_name;
                result.family_name = response.data.family_name;
            }
            return result
        })
    }

    function explorePrivate(provider, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/explore/' + provider + '/' + path
        }).then(function (response) {
            if(response.data.files){ // If Google
                response.data.entries = _.map(response.data.files, function(item){
                    return processDrive(item)
                })

            }else{
                response.data.entries = _.map(response.data.entries, function (item) {
                    return processDropbox(item)
                })
            }
            response.data.entries = _.filter(response.data.entries, function(file){
                return file['.tag'] == 'folder'
            });
            return response
        })
    }

    function fileStats(project, path) {
        return $http({
            method: 'GET',
            url: '/api/v1/sync/fileStats/' + project + '/' + path
        }).then(function(response){
            var result = {numFiles: 0};
            _.forEach(response.data, function(num, type){
                result.numFiles = result.numFiles + parseInt(num)
            })
            return result
        })
    }

    function processDropbox(metaInfo, projectStub) {
        metaInfo.path_display = metaInfo.path_display[0] == '/' ? metaInfo.path_display.substring(1) : metaInfo.path_display;
        if(projectStub){
            metaInfo.endingUrl   = SyncUtilService.getEndingUrl(projectStub, metaInfo.path_display, metaInfo.rev);
            metaInfo.downloadUrl = 'api/v1/sync/download/' + metaInfo.endingUrl;
        }
        metaInfo.name = SyncUtilService.getFileName(metaInfo.path_display);
        metaInfo.nameRaw = metaInfo.name.split('.')[0];
        metaInfo.path = metaInfo.path_display;
        metaInfo.pathStub = metaInfo.path_display;
        metaInfo.provider = 'dropbox';
        metaInfo.parentFolder = metaInfo.path_display.substr(0, metaInfo.path_display.lastIndexOf('/'));
        metaInfo.parentProject = projectStub;
        if (metaInfo['.tag'] == 'file') {
            metaInfo.fileType = SyncUtilService.getFileType(metaInfo.path_display);
        }
        return metaInfo
    }

    function processDrive(file, projectStub){

        var fileType;
        if(file.mimeType.indexOf('apps.document') != -1)    {fileType = 'gdoc'}
        if(file.mimeType.indexOf('apps.spreadsheet') != -1) {fileType = 'gsheet'}
        if(file.mimeType.indexOf('apps.presentation') != -1){fileType = 'gslides'}
        // Save folder name into path database.
        if(file.mimeType == 'application/vnd.google-apps.folder'){
            fileType = 'folder';
            cacheSave('sync-path-' + projectStub || 'absolute', {id : file.id, name: file.name, path: file.name, parent: file.parents[0]})
        }
        return {
            '.tag'          : file.mimeType == 'application/vnd.google-apps.folder' ? 'folder' : 'file',
            nameRaw         : file.name.split('.')[0],
            name            : (file.name.split('.').length > 1 || fileType == 'folder' || !fileType) ? file.name : file.name + '.' + fileType,
            path            : file.id,
            id              : file.id,
            pathStub        : file.id,
            parentFolder    : file.parents[0],
            parentProject   : projectStub,
            path_display    : file.id,
            client_modified : file.modifiedTime,
            rev             : file.revisionId || file.headRevisionId,
            size            : file.size,
            fileType        : file.fileExtension || fileType,
            webViewLink     : file.webViewLink,
            thumbLink       : file.thumbnailLink ? file.thumbnailLink.replace("=s220", "=s60") : '',
            provider        : 'drive',
            endingUrl       : SyncUtilService.getEndingUrl(projectStub, file.id, file.revisionId || file.headRevisionId),
            downloadUrl     : 'api/v1/sync/download/'+SyncUtilService.getEndingUrl(projectStub, file.id, file.revisionId || file.headRevisionId),
        }
    }
});
