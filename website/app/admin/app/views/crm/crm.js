angular.module('views.crm', [
]);
angular.module('views.crm').

config(function ($stateProvider) {
    $stateProvider.state('app.crm', {
        url: "/crm?page&criteria",
        templateUrl: "app/views/crm/crm.html",
        controller: 'CrmViewCtrl'
    });
}).

controller('CrmViewCtrl', function ($scope, $timeout, SearchService, HttpQuery, $http, $stateParams) {
    $scope.usersQuery = HttpQuery({
        url: '/api/v1/analytics/contactedButNotUpdated',
        params: {
            type: 'user',
            sort: 'signedup',
            size: 30,
            select: ['stub'],
            page: 0,
        },
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
});
