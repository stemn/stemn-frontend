angular.module('modules.tags', [
    'modules.popup-cards'
]);
angular.module('modules.tags').

directive('tags', function () {
    return {
        restrict: 'E',
        replace : true,
        scope: {
            tags     : '=',  // An array of tag objects
            type     : '@?', // field || user || project || organisation || location
            size     : '@?', // sm or xs or nothing for medium
            edit     : '=?', // true or false to show edit
            image    : '=?', // true or false to show image
            limit    : '=?', // number - the number of tags to show
            evidence : '=?', // true or false - If true and type=field we show the evidence for the field
            status   : '=?', // true or false - If true, we get the skill status for each field
            dropArea : '=?', // true or false - If true, the drop area is enabled
        },
        templateUrl: 'app/modules/tags/tpls/tags.html',
        link       : function (scope, element, attrs){
            var path = 'app/modules/tags/tpls/types/'
            if (scope.edit){
                scope.template = path + 'tag-edit.html';
            }
            else{
                scope.template = path + scope.type + '.html';
            }
        },
        controller : function ($scope, CoreLibrary, SkillsService, Authentication) {
            $scope.limit = $scope.limit || '1000';
            // Useful functions
            $scope.delTag = function (idx){
                $scope.tags.splice(idx, 1);
            }
            // Sortable
            $scope.sortableConfig = {
                handle: ".my-handle",
                animation: 150,
                group: $scope.type,
                onAdd: function (event){
                    CoreLibrary.uniqueArray(event.models, '_id');
				}
            };

            if($scope.status && $scope.type == 'field' && Authentication.currentUser._id){
                _.forEach($scope.tags, function(tag){
                    SkillsService.getStatus(tag._id).then(function(response){
                        tag.active = response.status;
                    })
                })
            }
        }
    };
}).

service('TagsModalService', function ($mdDialog) {
    this.editTags = function (event, data) {
    /****************************************************
    Data should contain the tags:
    data = {
        fields        : [],
        organisations : [],
        projects      : [],
    }

    This function returns a promise.
    This should be used to save or assign the results.

    ****************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/tags/tpls/tags-edit-modal.html',
            controller: 'TagsEditModalCtrl',
            targetEvent: event,
            locals : {
                data : data
            }
        })
    }
}).

controller('TagsEditModalCtrl', function(data, $scope, $mdDialog){
    // Isolate the data
    $scope.data = angular.copy(data);
    // Set funtions
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.data);
    };
});

