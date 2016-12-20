angular.module('views.app', [
    'modules.layout-options',
    'modules.horizontal-menu',
    'modules.transition-overlay',
    'modules.authentication',
    'modules.forum',
    'modules.overlay-tabs',
    'modules.invite',
    'modules.analytics',
]);
angular.module('views.app').

config(function ($stateProvider) {
    $stateProvider.
    state('app', {
        abstract: true,
        sticky: true,
        url: '?id&ref&org&hidebanner&slowscroll&invitecode&inviterole&invitegroup&secret&admin',
        templateUrl: 'app/views/app/app.html',
        resolve: {
            jwt: function(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            userdata: function (jwt, Authentication, $stateParams) {
                if(Authentication.getToken()){
                    return Authentication.loadUserData().then(function(userdata){
                        if($stateParams.admin === 'false'){
                            userdata.isAdmin = false;
                        }
                        return userdata
                    });
                }
            },
        },
        layout: {
        },
        menu: {
            main: [
                {
                    label : 'Dashboard',
                    sref  : 'app.dashboard.projects',
                    parent: 'app.dashboard',
                    authenticate : 'true'
                },{
                    label : 'Feed',
                    sref  : 'app.home',
                    authenticate : 'false'
                },{
                    label : 'Browse',
                    sref  : 'app.browse.all',
                    parent: 'app.browse',
                    authenticate : 'false',
                    sub : [{
                        label: 'Projects',
                        sref: 'app.browse.projects'
                    },{
                        label: 'Threads',
                        sref: 'app.browse.threads'
                    },{
                        label: 'Fields',
                        sref: 'app.browse.fields'
                    },{
                        label: 'Organisations',
                        sref: 'app.browse.organisations'
                    },{
                        label: 'Users',
                        sref: 'app.browse.users',
                    },{
                        label: 'Jobs',
                        sref: 'app.browse.jobs',
                        divider: true,
                    },{
                        label: 'Map',
                        sref: 'app.map'
                    }]
                },
            ],
            more: [
                {
                    label   : 'My Job Applications',
                    sref    : 'app.applications',
                    authenticate : true,
                },{
                    label   : 'Referrals & Prizes',
                    sref    : 'app.referrals',
                    authenticate : true,
                },{
                    label   : 'Following',
                    sref    : 'app.following.all',
                    divider : true,
                    authenticate : true,
                },{
                    label   : 'About',
                    sref    : 'app.project.overview({"stub":"stemn"})',
                    authenticate : 'false',
                },{
                    label   : 'FAQ',
                    sref    : 'app.faq',
                    authenticate : 'false',
                },{
                    label   : 'Landing Page',
                    sref    : 'app.landing.sync',
                    authenticate : 'false',
                }
            ],
        },
        authLevel: 'public',
        controller: function (userdata, $localStorage, $scope, $timeout, $state, $location, Authentication, LayoutOptions, $mdSidenav, $stateParams, ReferralsService, InviteService) {

			ReferralsService.setRefCode();
			InviteService.setInviteCode();

            // Save the initial state to local storage
            if(!$localStorage.initialState){
                $localStorage.initialState = {
                    name  : $state.current.name,
                    params: $state.params,
                }
            }

            $scope.LayoutOptions = LayoutOptions;
            // Material
            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };
            // Hack to remove duplicate ui-views
            $timeout(function(){
                var bodyChildren = angular.element(document.body).children();
                _.forEach(bodyChildren, function(child){
                    if(child.hasAttribute('ui-view')){
                        if(child.innerHTML.length === 0){
                            child.remove();
                        }
                    }
                })
            },100)
        },
        seo: function(resolve){
            return {
                title       : "STEMN - The Largest Community for Space Projects, Questions and Answers",
                picture     : "/uploads/upload_05fd16476dd86c21c8d09ae149a0f734.png",
                description : "STEMN is a network connecting the knowledge of the international space community. Showcase your projects, get recognition for your research, and discover what the rest of the community is creating. Let's build space. Together."
            }
        }
    });
});
