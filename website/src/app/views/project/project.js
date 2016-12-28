import './project.scss';
import './project-files/project-files.js';
import './project-settings/project-settings.js';
import './project-threads/project-threads.js';
import './project-wiki/project-wiki.js';

angular.module('views.project', [
    'views.project.files',
    'views.project.wiki',
    'views.project.threads',
    'views.project.settings',

    'modules.project',
    'modules.publish',
    'modules.filters',
    'modules.missing-fields',
    'modules.scroll-highlight'
]);
angular.module('views.project').

config(function ($stateProvider) {
    $stateProvider.
    state('app.project', {
        abstract: true,
        url: '/projects/:stub?edit&reply',
        template: require('./tpls/project.html'),
        controller: 'ProjectViewCtrl',
        resolve: {
            project: function (userdata, ProjectService, $stateParams, PublishService, $state, $timeout, $q) {
				// userdata required
                return ProjectService.getProject($stateParams.stub).
                catch(function (project) {
                    $timeout(function(){$state.go('app.404', null, {location: false})})
                })
            },
            userPermissions: function(userdata, project, PermissionsService, $stateParams){
                return PermissionsService.permissionRedirect({
                    userdata : userdata,
                    entity   : project,
                    level    : project.permissions.projectType == 'public' ? 'public' : 'viewer',
                    secret   : $stateParams.secret
                })
            },
        },
        layout: {
            size: 'md',
        },
        seo: function(resolve){
            return {
                title       : resolve.project.name ? resolve.project.name + ' - STEMN' : 'Untitled Project - STEMN',
                picture     : resolve.project.picture,
                description : resolve.project.blurb
            }
        }
    }).
    state('app.project.overview', {
        url: '',
        sticky: true,
        overlay: false,
        template: require('./tpls/project-overview.html'),
    }).
//    state('app.project.about', {
//        url: '/about',
//        template: require('./tpls/project-about.html'),
//        layout: {
//            bgColor: 'rgba(0, 0, 0, 0.03)'
//        },
//        seo: function(resolve){
//            return {
//                title       : 'About ' + resolve.project.name + ' - STEMN',
//            }
//        }
//    }).
    state('app.project.blogs', {
        url: '/blog',
        template: require('./tpls/project-blog.html'),
        layout: {
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function(resolve){
            return {
                title       : 'Updates - ' + resolve.project.name + ' - STEMN',
            }
        }
    })
}).

controller('ProjectViewCtrl', function (userPermissions, $scope, $document, $timeout, $state, $http, project, Authentication, ProjectStatusData, UsersModalService,
                                         SocialModalService, HighlightElement, CoreLibrary, LicenseData, $dynamicFooter, $mdToast, ProjectService, PublishService) {
    // Interface Initialisation -----------------------------------
    //True if user's project, false is someone else's
    $scope.userCanEdit     = userPermissions.isMin('collaborator');
    $scope.userPermissions = userPermissions;

    $scope.showEdit = $scope.userCanEdit;

	// Tabs ------------------------------------------------------
	$scope.tabs = [
        {
            label: 'Overview',
            sref: 'app.project.overview'
        },{
            label: 'Files',
            sref: 'app.project.files',
            isHidden: function(){
                return !project.remote.provider && !$scope.showEdit
            }
        },{
            label: CoreLibrary.pluralise(project.numThreads, 'Thread'),
            sref: 'app.project.threads'
        }
	];
	$scope.$watch(function(){
		$scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);
	})

    // Data ------------------------------------------------------
    $scope.project            = project;

    // Scoped Functions
    $scope.isSectionContent = isSectionContent; //function()

	$scope.editorOptions = {
		realtime  : false,
		contained : true
	}

    $scope.editExpands = {
        details : false,
    }

    $scope.toc = {
        content : [],
        prepend   : [{
            id    : 'entityTitle',
            level : 'H1',
            label : $scope.project.name
        }],
        append    : [{
            id    : 'responses',
            level : 'H2',
            label : 'Comments'
        }]
    }

    // Function --------------------------------------------------

    function isSectionContent(){
        return _.any($scope.project.sectionData.sectionOrder, function(sectionId){
            return $scope.project.sectionData.sections[sectionId] && $scope.project.sectionData.sections[sectionId].content && $scope.project.sectionData.sections[sectionId].content.length>10
        })
    }

    // Project Status
    $scope.projectStatuses = ProjectStatusData;
    $scope.$watch('project.status', function(){
        $scope.status = _.find($scope.projectStatuses, { 'value' : $scope.project.status })
    });

    $scope.licenses = LicenseData.licenses;
    $scope.$watch('project.license', function(){
        $scope.license = _.find($scope.licenses, { 'type' : $scope.project.license })
    });

}).

directive('projectThumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope:{
            editorSections: '=',
            images: '=?' // Images object to be passed up to parent scope
        },
        template: require('./tpls/project-thumbs.html'),
        controller: function($scope){
            $scope.images = parseImages($scope.editorSections);

            //////////////

            function parseImages(sectionData){
                var images = [];
                _.forEach(sectionData.sections, function(section){
                    if(section.type == 'image'){
                        images.push(section)
                    }
                })
                return images
            }
        },
    };
});
