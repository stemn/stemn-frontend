angular.module('views.organisations', [
    'modules.search-wiki'
]);
angular.module('views.organisations').

config(function ($stateProvider) {
    $stateProvider.state('app.organisations', {
        url: "/organisations",
        templateUrl: "app/views/organisations/organisations.html",
        controller: 'OrganisationsViewCtrl'
    });
}).

controller('OrganisationsViewCtrl', function ($scope, HttpQuery) {
    // Main query object
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        params: {
            type: 'organisation',
            size: 20,
            select   : ['stub', 'adminData', 'logo'],
            criteria : {}
        },
        columns: [
            {
                status: true,

                name: '',
                template: '<a ui-sref="app.organisation({\'stub\': item.stub})" class="avatar-square-contain block" style="background-image: url(\'https://stemn.com{{item.logo.url || \'/assets/images/default/org.png\'}}?size=thumb\')")"></a>',
                model: 'logo.url',

                width: '40px',
                sort: false
            },{
                status: true,
                search: true,
                name: 'Name',
                template: '<a ui-sref="app.organisation({\'stub\': item.stub})" class="underlined">{{item.name}}</a>',
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
                name: 'Type',
                model: 'organisationType',
                width: '140px',
                template: `<organisation-type entity="item"</organisation-type>`,
            },{
                status: true,
                name: 'Actions',
                model: 'temp',
                width: '100px',
                template: `<organisation-row-actions entity="item" query="query"></organisation-row-actions>`,
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
            $scope.query.params.criteria       = {};
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

directive('organisationRowActions', function () {
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
                    EntityService.remove('organisation',id).then(function (response) {
                        EntityService.removeSuccess();
                        $scope.query.refresh();
                    })
                }
            }

            function edit(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/organisations/tpls/edit-organisation-modal.html',
                    controller: function(data, $scope, $http){
                        $scope.item = data;
                        $scope.itemName   = $scope.item.name + ' logo';
                        $scope.blurbQuery  = $scope.item.name;
                        $scope.imagesQuery = $scope.item.name;

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.save = function () {
                            EntityService.update('organisation', $scope.item).then(function(){
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
}).

directive('organisationType', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
        },
        template: `
        <md-input-container class="m-0">
            <md-select class="md-accent" ng-model="entity.organisationType" ng-change="save()" placeholder="Type">
                <md-option ng-repeat="item in types" value="{{item.model}}">
                    {{item.name}}
                </md-option>
            </md-select>
        </md-input-container>
        `,
        controller: function ($scope, LogService, $http, CoreLibrary, EntityService) {
            $scope.save = function () {
                var entity = {
                    _id              : $scope.entity._id,
                    organisationType : $scope.entity.organisationType,
                }
                EntityService.patch('organisation', entity).then(EntityService.updateSuccess);
            }
            $scope.types = [{
                model: '',
                name : 'None'
            },{
                model: 'school',
                name : 'School',
            },{
                model: 'company',
                name : 'Company',
            }];

        }
    };
});
