angular.module('views.fields', ['modules.image.search']);
angular.module('views.fields').

config(function ($stateProvider) {
    $stateProvider.state('app.fields', {
        url: "/fields",
        templateUrl: "app/views/fields/fields.html",
        controller: 'FieldsViewCtrl'
    });
}).

controller('FieldsViewCtrl', function ($scope, HttpQuery, $mdDialog, $mdToast, FieldService, $http) {
    // Main query object
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'field',
            size: 20,
            select   : ['stub', 'adminData', 'banner'],
            criteria : {}
        },
        columns: [
            {
                status: true,

                name: '',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.banner.url || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'picture',

                width: '40px',
                sort: false
            },{
                status: true,
                search: true,
                name: 'Name',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="underlined">{{item.name}}</a>',
                model: 'name',
            },{
                status: true,
                name: 'Blurb',
                template: '{{item.blurb | words: 15}}',
                model: 'blurb',
            },{
                status: true,
                name: '# Projects',
                model: 'numProjects',
                width: '140px'
            },{
                status: true,
                name: '# Threads',
                model: 'numThreads',
                width: '140px'
            },{
                status: true,
                name: '# Jobs',
                model: 'numJobs',
                width: '140px'
            },{
                status: true,
                name: 'Actions',
                model: 'temp',
                width: '100px',
                template: `<field-row-actions entity="item" query="query"></field-row-actions>`,
            }
        ],
        filters: {
            columnOrder : {}
        }
    });


    // Filters
    $scope.searchFilter = {
        model: '',
        key  : 'name',
        options: [{
            model : 'name',
            name  : 'Name'
        },{
            model : 'blurb',
            name  : 'Blurb'
        }],
        onChange: function(){
            $scope.query.params.criteria = {};
            if($scope.searchFilter.model){
                $scope.query.params.criteria[$scope.searchFilter.key]  = '/'+$scope.searchFilter.model+'/i';
            }
            $scope.query.refresh();
        }
    }

    // Init
    $scope.query.determineSelect();
    $scope.query.more();
}).

directive('fieldRowActions', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            query:  '='
        },
        template: `
             <div layout="row">
                <md-button aria-label="edit" class="md-icon-button" ng-click="edit($event, entity)">
                    <ng-md-icon icon="edit"></ng-md-icon>
                </md-button>
                <md-button aria-label="delete" class="md-icon-button" ng-click="remove(entity._id)">
                    <ng-md-icon icon="close"></ng-md-icon>
                </md-button>
            </div>
        `,
        controller: function ($scope, HttpService, $mdDialog, $mdToast, EntityService) {
            $scope.remove   = remove;   // function(id)
            $scope.edit     = edit;     // function(event, data)


            ////////////////////////////////////////

            function remove(id){
                if (confirm('Are you sure you want to delete this?')) {
                    EntityService.remove('field',id).then(function (response) {
                        EntityService.removeSuccess();
                        $scope.query.refresh();
                    })
                }
            }

            function edit(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/fields/tpls/edit-field-modal.html',
                    controller: function(data, $scope){
                        $scope.item = data;
                        $scope.itemName = $scope.item.name;
                        $scope.blurbQuery = $scope.item.name;

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.save = function () {
                            EntityService.update('field', $scope.item).then(function(){
                                EntityService.updateSuccess();
                                $mdDialog.hide();
                            })
                        }
                    },
                    locals: {data:data},
                    targetEvent: event,
                    clickOutsideToClose: true,
                })
            }
        }
    };
});
