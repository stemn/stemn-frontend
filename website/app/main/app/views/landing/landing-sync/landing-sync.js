angular.module('views.landing.sync', [
]);
angular.module('views.landing.sync').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing.sync', {
        url: '',
        templateUrl: 'app/views/landing/landing-sync/tpls/landing-sync.html',
        controller: function($scope, $timeout, $interval){
            $scope.slider = {
                width: 50
            }

            animateSlider()
            $interval(animateSlider,10000)

            /////////////////////

            function animateSlider(){
                $timeout(function(){
                    $scope.slider.width = 100;
                },1000)
                $timeout(function(){
                    $scope.slider.width = 0;
                },2000)
                $timeout(function(){
                    $scope.slider.width = 50;
                },3000)
            }
        },
        layout: {
            size      : 'md',
            sidebar   : false,
            footer    : true,
            topBanner : false
        },
    });
}).

directive('landingTimeline', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/views/landing/landing-sync/tpls/landing-timeline.html',
        controller: function($scope){

            $scope.iconMap = {
                fileUpdate  : 'editor:mode_edit',
                fileCreate  : 'content:add',
                projectUpdate : 'editor:mode_edit',
                comment     : 'editor:mode_comment',
                invite      : 'social:person_add',
            }
            $scope.colorMap = {
                fileUpdate    : '#FDC852',
                fileCreate    : '#46B7DF',
                projectUpdate : '#FDC852',
                comment       : '#8CC04D',
                invite        : '#ED7274',
            }

            var time = new Date().getTime();

            $scope.timeline = [{
                timestamp: time,
                event: 'fileUpdate',
                user : {
                    name: 'Emily Richard',
                    picture: 'assets/images/landing/sync/faces/face (2).jpg'
                },
                html: 'Created a new version. V.5'
            },{
                timestamp: time - 1000 * 60 * 60 * 3.67,
                event: 'invite',
                user : {
                    name: 'Dan Cooper',
                    picture: 'assets/images/landing/sync/faces/face (5).jpg'
                },
                html: 'Was added to this project by <span class="text-green">@SarahCullen</span>'
            },{
                timestamp: time - 1000 * 60 * 60 * 42.98,
                event: 'comment',
                user : {
                    name: 'Jon Davis',
                    picture: 'assets/images/landing/sync/faces/face (4).jpg'
                },
                html: 'Done. It\'s ready to go! <span class="text-green">@LucasArmstrong</span>'
            },{
                timestamp: time - 1000 * 60 * 60 * 48.13,
                event: 'projectUpdate',
                user : {
                    name: 'Sarah Cullen',
                    picture: 'assets/images/landing/sync/faces/face (3).jpg'
                },
                html: 'Updated this project.'
            },{
                timestamp: time - 1000 * 60 * 60 * 52.13,
                event: 'comment',
                user : {
                    name: 'Lucas Armstrong',
                    picture: 'assets/images/landing/sync/faces/face (1).jpg'
                },
                html: '<span class="text-green">@JonDavis</span> can you reduce the tolerences by 1mm for manufacture?'
            }]
        }
    };
});
