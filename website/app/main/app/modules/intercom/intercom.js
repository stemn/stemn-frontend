angular.module('modules.intercom', [

]);
angular.module('modules.intercom').

run(function ($timeout, $rootScope, Authentication, CoreLibrary) {

    window.Intercom("boot", {
        app_id: "k5sc7t8b"
    });

    ////////////////////////////////////////////

    $timeout(function(){
        if(Authentication.currentUser.isLoggedIn()){
            window.Intercom("boot", {
                app_id: "k5sc7t8b",
                name: Authentication.currentUser.name,
                user_id: Authentication.currentUser._id,
                email: Authentication.currentUser.email,
                created_at: CoreLibrary.getDateFromId(Authentication.currentUser._id).getTime() / 1000
            });
        }
        else{
            window.Intercom("boot", {
                app_id: "k5sc7t8b"
            });
        }
    }, 1000);

    $rootScope.$on('authentication.logIn', function(){
        window.Intercom("update", {
            name: Authentication.currentUser.name,
            user_id: Authentication.currentUser._id,
            email: Authentication.currentUser.email,
            created_at: CoreLibrary.getDateFromId(Authentication.currentUser._id).getTime() / 1000
        });
    });

    $rootScope.$on('authentication.logOut', function(){
        if(window.Intercom){
            window.Intercom("shutdown");
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
         window.Intercom("update");
    });

});
