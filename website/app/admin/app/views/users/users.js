angular.module('views.users', [
    'modules.search',
    'modules.tables'
]);
angular.module('views.users').

config(function ($stateProvider) {
    $stateProvider.state('app.users', {
        url: "/users?page&criteria",
        templateUrl: "app/views/users/users.html",
        controller: 'UsersViewCtrl'
    });
}).

controller('UsersViewCtrl', function ($scope, $timeout, SearchService, HttpQuery, $http, $stateParams) {
    var parsedCriteriaParams = $stateParams.criteria ? JSON.parse($stateParams.criteria) : {};

    $scope.usersQuery = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['page', 'criteria'],
        params: {
            type: 'user',
            sort: 'signedup',
            size: 30,
            select: ['stub'],
            page: ($stateParams.page || 0),
            criteria: parsedCriteriaParams
        },
        paginate: true,
        columns: [
            {
                status: true,

                name: '',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                model: 'picture',

                width: '40px',
                sort: false
            },{
                status: true,
                search: true,
                name: 'Name',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.stub})" class="underlined">{{item.name}}</a>',
                model: 'name',
            }, {
                status: true,
                name: '# Projects',
                model: 'numProjects',
                width: '85px'
            }, {
                status: false,
                name: '# Threads',
                model: 'numThreads',
                width: '85px'
            },{
                status: false,
                name: '# Posts',
                model: 'numPosts',
                width: '85px'
            },{
                status: false,
                name: '# Comments',
                model: 'numComments',
                width: '100px'
            },{
                status: true,
                name: '# Applications',
                model: 'numApplications',
                template : '<div click-show-applications parent-type="user" parent-id="{{item._id}}">{{item.numApplications}}</div>',
                width: '120px'
            }, {
                status: true,
                name: 'Followers',
                model: 'followers',
                width: '85px'
            },{
                status: true,
                name: 'Contacted By',
                template: '{{item.adminData.contacted[0].contactedBy}}',
                model: 'adminData.contacted[0].contactedBy',
                width: '120px'
            },{
                status: false,
                name: 'Contacted Date',
                template: '{{item.adminData.contacted[0].date | amTimeAgo}}',
                model: 'adminData.contacted[0].date',
                width: '85px'
            },{
                status: true,
                name: 'Signed up Date',
                template: '{{item.signedup | amTimeAgo}}',
                model: 'signedup',
                width: '85px'
            },{
                status: true,
                name: 'Education',
                template: '<user-organisation-encode entity="item" type="education"></user-organisation-encode>',
                model: 'profile.profileDetails',
                width: '300px',
            },{
                status: false,
                name: 'Experience',
                template: '<user-organisation-encode entity="item" type="experience"></user-organisation-encode>',
                model: 'profile.profileDetails',
                width: '300px',
            }, {
                status: true,
                name: 'Rating',
                model: 'adminData.rating',
                width: '140px',
                template: "<user-rating entity='item' entities='query.results' selected-rows='selectedRows' rating-type='rating'></user-rating>",
            }, {
                status: true,
                name: 'Potential Rating',
                model: 'adminData.potentialRating',
                width: '140px',
                template: "<user-rating entity='item' entities='query.results' selected-rows='selectedRows' rating-type='potentialRating'></user-rating>",
            }, {
                status: true,
                name: 'Email',
                model: 'profile.email',
                width: '100px',
                template: "{{item.profile.email}}",
            }
        ],
        filters: {
            columnOrder : {}
        }
    });
    $scope.usersQuery.determineSelect();
    $scope.usersQuery.init();

    // Search Filter -------------------------------
    $scope.searchFilter = SearchService.newFilter({
        type : 'search',
        query: $scope.usersQuery,
        key  : 'name',
        options: [{
            model : 'name',
            name  : 'Name'
        },{
            model : 'blurb',
            name  : 'Blurb'
        },{
            model : 'profile.profileDetails.education.school',
            name  : 'School'
        },{
            model : 'profile.profileDetails.experience.company',
            name  : 'Company'
        },{
            model : 'profile.email',
            name  : 'Email'
        }],
    });
    $scope.searchFilter.parseParams(parsedCriteriaParams)
}).


directive('userOrganisationEncode', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            type  : '@', // education || experience
        },
        template: `
        <div ng-repeat="item in entity.profile.profileDetails[type]" layout="row" layout-align="start center">
            <organisation-search class="typeahead-compact" search-text="item[subKey]" data="item.organisations" single="true" organisation-type="{{subKey}}" style="padding-bottom: 15px"></organisation-search>
        </div>
        <md-button class="md-raised md-accent m-0" ng-click="saveUser()">Save</md-button>
        `,
        controller: function ($scope, LogService, $http, CoreLibrary, EntityService) {
            $scope.subKey = $scope.type == 'education' ?  'school' : 'company';
            $scope.saveUser = function () {
                var entity = { _id : $scope.entity._id, profile : { profileDetails : {} } };
                entity.profile.profileDetails[$scope.type] = $scope.entity.profile.profileDetails[$scope.type];
                EntityService.patch('user', entity).then(EntityService.updateSuccess);
            }
        }
    };
});
