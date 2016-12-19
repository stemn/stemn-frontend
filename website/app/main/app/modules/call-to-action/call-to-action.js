angular.module('modules.call-to-action', [
    'ngMaterial',
]);
angular.module('modules.call-to-action').

directive('callToAction', function (callToActionService, ThreadCreateModalService, ProjectCreateModalService, AuthenticationModalService, UsersModalService, NewCreationsService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            size : '@' // sm || lg
        },
        templateUrl: 'app/modules/call-to-action/tpls/call-to-action.html',
        controller: function($scope){
            getBanner();
            // Get a new banner when we log in (this will make sure there are not logged-out only banners).
            $scope.$on("authentication.logIn", getBanner)
            $scope.$on("authentication.logOut", getBanner)
            $scope.close = function(){
                $scope.hideCta = true;
            }
            // Hoisted  functions -----------------------------
            function getBanner(){
                $scope.banner = callToActionService.getBanner();
            }
        }
    };
}).

service('callToActionService', function (Authentication) {
    var service = this;
    this.bannerDetails = {
        b1 : {
            templateUrl : 'app/modules/call-to-action/tpls/cta-referrals.html',
        },
        b2 : {
            templateUrl : 'app/modules/call-to-action/tpls/cta-map.html',
        },
        b3 : {
            templateUrl : 'app/modules/call-to-action/tpls/cta-project.html',
        }
    };
    // Initialise first random banner
    this.numBanners   = Object.keys(service.bannerDetails).length;          // Get number of banners
    this.bannerIndex  = Math.floor(Math.random() * service.numBanners) + 1; // Get a random banner index

    this.getBanner       = function(){
        var banner = 'b' + (service.bannerIndex % service.numBanners + 1);
        service.bannerIndex ++
        // If we are logged in, dont show the noAccount banners
        if(service.bannerDetails[banner].noAccount == Authentication.currentUser.isLoggedIn()){
            return service.getBanner();
        }
        else{
            return service.bannerDetails[banner];
        }
    };
});
