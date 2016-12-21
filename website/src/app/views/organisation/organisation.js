import './organisation.scss';
import './organisation-settings/organisation-settings.js'

angular.module('views.organisation', [
    'views.organisation.settings',
    'modules.organisations',
    'modules.contributors',
    'modules.request-ownership', // request ownership button
]);
angular.module('views.organisation').
config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
    // Map default
    when("/org/:stub", "/org/:stub/overview").
    // Map creations
//    when("/org/:stub/projects", "/org/:stub/creations/projects").
//    when("/org/:stub/top",      "/org/:stub/creations/top").
//    when("/org/:stub/threads",  "/org/:stub/creations/threads").
//    when("/org/:stub/blogs",    "/org/:stub/creations/blogs").
    when("/org/:stub/people",    "/org/:stub/people/contributors").
    // Map organisation to org (for jackson)
    when("/organisations/:stub", "/org/:stub");

    $stateProvider.
    state('app.organisation', {
        url: '/org/:stub?projectview&location&edit&showEdit',
        abstract: true,
        templateUrl: 'app/views/organisation/organisation.html',
        resolve: {
            organisation: function (OrganisationService, $stateParams) {
                return OrganisationService.getOrganisation($stateParams.stub).then(function (organisation) {
                    return organisation;
                });
            },
            userPermissions: function(userdata, organisation, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : organisation,
                    level    : 'public',
                    secret   : $stateParams.secret
                })
            },
        },
        controller: 'OrganisationViewCtrl',
        seo: function(resolve){
            return {
                title       : resolve.organisation.name + ' Organisation - STEMN',
                picture     : resolve.organisation.picture,
                description : resolve.organisation.blurb
            }
        },
        layout: {
            size: 'md',
            footer: true,
        },
    }).
    state('app.organisation.overview', {
        url: '/overview',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-overview.html',
        controller: 'OrganisationOverviewCtrl',
        layout: {
            size: 'lg',
            footer: true,
        },
    }).
    state('app.organisation.applications', {
        url: '/applications',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-applications.html',
        controller: 'OrganisationOverviewCtrl',
    }).
    state('app.organisation.people', {
        url: '/people',
        sticky: true,
        abstract: true,
        templateUrl: 'app/views/organisation/tpls/organisation-people.html',
        controller: function($scope, CoreLibrary){
        	$scope.tabs = [
                {
                    label: CoreLibrary.pluralise($scope.organisation.numContributors, 'Contributor'),
                    sref: 'app.organisation.people.contributors'
                },{
                    label: CoreLibrary.pluralise($scope.organisation.followers, 'Follower'),
                    sref: 'app.organisation.people.followers'
                },{
                    label: ($scope.organisation.numEducations || 0) + ' Alumni',
                    sref: 'app.organisation.people.alumni'
                },
        	];
        },
    }).
    state('app.organisation.people.followers', {
        url: '/followers',
        templateUrl: 'app/views/organisation/tpls/organisation-followers.html',
        seo: function(resolve){
            return {
                title       : 'Followers of the ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Followers'
        }
    }).
    state('app.organisation.people.contributors', {
        url: '/contributors',
        templateUrl: 'app/views/organisation/tpls/organisation-contributors.html',
        seo: function(resolve){
            return {
                title       : 'People Contributing to the ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Contributors'
        }
    }).
    state('app.organisation.people.alumni', {
        url: '/alumni',
        templateUrl: 'app/views/organisation/tpls/organisation-alumni.html',
        seo: function(resolve){
            return {
                title       : 'People that went to ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Alumni'
        }
    }).
    state('app.organisation.jobs', {
        url: '/jobs',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-jobs.html',
        seo: function(resolve){
            return {
                title       : 'Jobs openings at ' + resolve.organisation.name + ' - STEMN',
            }
        },
        data: {
            name: 'Jobs'
        }
    }).
    state('app.organisation.projects', {
        url: '/projects',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-projects.html',
        seo: function(resolve){
            return {
                title       : 'Projects Created by the ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Projects'
        }
    }).
    state('app.organisation.forum', {
        url: '/forum',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-forum.html',
        seo: function(resolve){
            return {
                title       : 'Questions and Answers from the ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Forum'
        },
    }).
    state('app.organisation.blogs', {
        url: '/blogs',
        sticky: true,
        templateUrl: 'app/views/organisation/tpls/organisation-blogs.html',
        seo: function(resolve){
            return {
                title       : 'Blogs and Updates from the ' + resolve.organisation.name + ' Organisation - STEMN',
            }
        },
        data: {
            name: 'Updates'
        }
    });
}).

controller('OrganisationOverviewCtrl', function (organisation, $scope, OrganisationService, FeedService, RelatedService) {
    getProjects();
    getRelated(1)

    ////////////////////////////////////////////////////////////////////////

    function getProjects(){
        FeedService.getFeed({
            parentType: 'organisation',
            parentId: organisation._id,
            type: 'projects',
            sort: 'submitted',
            size: 10,
            page: 1,
            published: true
        }).then(function (feed) {
            $scope.projects = feed;
        })
    }

    function getRelated(page){
        RelatedService.getRelated({
            parentType : 'organisation',
            parentId   : organisation._id,
            type       : 'organisation',
            page       : page,
            size       : 6
        }).then(function(related) {
            $scope.related = related;
        })
    }


}).

controller('OrganisationViewCtrl', function (userPermissions, $scope, $rootScope, $state, $stateParams, Authentication, OrganisationService, JobModalService, ThreadCreateModalService, CoreLibrary, organisation, MenuItems, ProjectCreateModalService) {
    $scope.userPermissions = userPermissions;
    $scope.organisation   = organisation;
    $scope.newProject     = newProject;                   //function(event)
    $scope.newThread      = newThread;                    //function(event, type)
    $scope.newJob         = JobModalService.createJob;    //function(event)

    $scope.userCanEdit    = $scope.userPermissions.isMin('collaborator');
    $scope.showEdit       = $scope.userCanEdit;

    $scope.numContributorsString = CoreLibrary.pluralise($scope.organisation.numContributors, 'Creator');

    // Tabs ------------------------------------------------------
	$scope.tabs = [
        {
            label: 'Overview',
            sref: 'app.organisation.overview'
        },{
            label: CoreLibrary.pluralise($scope.organisation.numThreads || 0, 'Discussion'),
            sref: 'app.organisation.forum'
        },{
            label: CoreLibrary.pluralise($scope.organisation.numProjects || 0, 'Project'),
            sref: 'app.organisation.projects'
        },{
            label: CoreLibrary.pluralise($scope.organisation.numBlogs || 0, 'Blog'),
            sref: 'app.organisation.blogs'
        },{
            label: CoreLibrary.pluralise($scope.organisation.numJobs, 'Job'),
            sref: 'app.organisation.jobs'
        },{
            label: CoreLibrary.pluralise($scope.organisation.numContributors +  $scope.organisation.followers + ($scope.organisation.numEducations || 0), 'People'),
            sref: 'app.organisation.people.contributors'
        }
	];

    //////////////////////////////////////////////////

    function newProject(event){
        ProjectCreateModalService.newProject(event, {
            organisations : [ organisation ]
        })
    }
    function newThread(event, type){
        ThreadCreateModalService.newThread(event, {
            type: type || 'question',
            organisations : [ organisation ]
        })
    }

});
