import './widget-timeline.scss';

angular.module('modules.feed.widget-timeline', []);
angular.module('modules.feed.widget-timeline').

//directive('feedWidget', function () {
//    return {
//        restrict: 'E',
//        scope: {
//            parentId: '@', // The id of the parent
//            parentType: '@', // project || organisation
//            parent: '=?', // The parent object - This is used to create a more detailed empty message
//            type: '@', // blogs || discussions || all
//            data: '=?', // Feed data from resolve
//            published: '=?', // true || false || 'both' - true behavior defaults
//            showEdit: '=?' // true || false - will enabled edit features
//
//        },
//        template: require('./tpls/feed-widget.html'),
//        controller: 'feedWidgetCtrl'
//    }
//}).


directive('feedWidgetTimeline', function () {
    return {
        restrict:   'E',
        scope: {
            parentId: '@', // The id of the parent
            parentType: '@', // project || organisation
            parent: '=?', // The parent object - This is used to create a more detailed empty message
            type: '@', // blogs || discussions || all
            data: '=?', // Feed data from resolve
            published: '=?', // true || false || 'both' - true behavior defaults
            showEdit: '=?' // true || false - will enabled edit features

        },
        template: require('./tpls/feed-widget-timeline.html'),
        controller: 'feedWidgetCtrl'
    }
}).

controller('feedWidgetCtrl', function ($scope, ThreadCreateModalService, ProjectCreateModalService, CoreLibrary, HttpQuery) {

    // Initiate
    var typeInfos = {
        blogs: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.blogs' : 'app.' + $scope.parentType + '.blogs',
            inputPlaceholder: 'Add a Blog',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'blog',
            empty: 'No updates yet.'
        },
        discussions: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.threads' : 'app.' + $scope.parentType + '.forum',
            inputPlaceholder: 'Add a question',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'general', // This could also be question
            empty: 'No questions yet.'
        },
        all: {
            moreSref: $scope.parentType == 'project' ? 'app.' + $scope.parentType + '.threads' : 'app.' + $scope.parentType + '.forum',
            inputPlaceholder: 'Add a Discussion',
            inputFn: ThreadCreateModalService.newThread,
            inputFnType: 'general', // This could also be question
            empty: 'Nothing yet.'
        },
    }

    $scope.query = HttpQuery({
        url: 'api/v1/feed',
        params: {
            parentType: $scope.parentType,
            parentId: $scope.parentId,
            type: $scope.type,
            sort: 'submitted',
            size: 4,
            published: $scope.published,
        },
        onSuccess: function (response) {
            _.forEach(response, function (item) {
                item.data.sref = CoreLibrary.getSref(item.data.type, item.data.stub);
            })
            return response
        }
    });
    $scope.query.more();

    $scope.typeInfo = typeInfos[$scope.type];


    // Set the input function data object
    // This is used to create a thread/project that already has some tags
    $scope.inputFnData = {}; // Set the fields || organisations || projects array
    if ($scope.parentType == 'organisation') {
        $scope.inputFnData.organisations = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture,
        }];
        $scope.inputFnData.fields = $scope.parent.fields;
    } else if ($scope.parentType == 'project') {
        $scope.inputFnData.projects = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture,
        }];
        $scope.inputFnData.organisations = $scope.parent.organisations;
    } else if ($scope.parentType == 'field') {
        $scope.inputFnData.fields = [{
            _id: $scope.parent._id,
            stub: $scope.parent.stub,
            name: $scope.parent.name,
            picture: $scope.parent.picture,
        }];
    }

    $scope.inputFnData.type = $scope.typeInfo.inputFnType;
});
