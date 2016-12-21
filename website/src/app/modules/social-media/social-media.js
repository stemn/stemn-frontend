import './social-media.scss';

angular.module('modules.social-media', [
    'modules.authentication'
]);
angular.module('modules.social-media').

service('SocialModalService', function($mdDialog){
    this.sharePrompt = sharePrompt; // function(event, data)

    /////////////////////////////////////////////////////

    function sharePrompt (event, data) {
        /***********************************************************
        data = {
            entity: 'project' || 'blog' || 'question' - This is used in the title and body
        }
        ************************************************************/
        return $mdDialog.show({
            templateUrl: 'app/modules/social-media/tpls/social-prompt-modal.html',
            controller: function($scope, $mdDialog, data){
                $scope.data = data;
                $scope.cancel = $mdDialog.hide; //function()
            },
            targetEvent: event,
            clickOutsideToClose: true,
            locals : {
                data  : data,
            }
        })
    }

}).

directive('socialShareButton', function (Authentication) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/social-media/tpls/social-share-button.html',
        scope: {
            title   : '@?',// Optional, reverts to default
            summary : '@?',// Optional, reverts to default
            root    : '@?' // If root is true, link to root, stemn.com
        },
        controller  : function ($scope, $rootScope, $location) {
            // Set defaults ------------------------------------------
            if($scope.root == 'true'){
                // set the url if root is true
                $scope.url  = 'https://stemn.com/';
                // fetch the ref code
                $scope.ref  = Authentication.currentUser.ref;
                // add the ref code if it exists
                if($scope.ref){$scope.url = $scope.url.concat('?ref='+Authentication.currentUser.ref)}
            }
            else{
                // set the url to the current page otherwise
                $scope.url = $location.absUrl();
                // If it includes the edit state param, remove it
                var index = $scope.url.indexOf('?edit=') || $scope.url.indexOf('&edit=')  ;
                if(index){
                    $scope.url = $scope.url.substring(0, index);
                }
            }
            $scope.title = $scope.title     || $rootScope.page.title;
            $scope.summary = $scope.summary || $rootScope.page.description;
            // Create the links for the share buttons
            $scope.shares = [
                {
                    title : 'Share to Facebook',
                    icon  : 'fa-facebook',
                    href  : "https://www.facebook.com/sharer/sharer.php?u=" + $scope.url
                },{
                    title : 'Share to Twitter',
                    icon  : 'fa-twitter',
                    href  : "https://twitter.com/home?status=" + $scope.summary + "%20%20@stem_network%20" + $scope.url
                },{
                    title : 'Share to Linkedin',
                    icon  : 'fa-linkedin',
                    href  : "https://www.linkedin.com/shareArticle?mini=true&url=" + $scope.url + "&title=" + $scope.title + "&summary=" + $scope.summary + "&source="
                }
            ];

        }
    };
}).

directive('socialShareButtons', function (Authentication) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/social-media/tpls/social-share-buttons.html',
        scope: {
            title   : '@?', // Optional, reverts to default
            summary : '@?', // Optional, reverts to default
            root    : '@?', // If root is true, link to root, stemn.com
            tiles   : '=?', // true || false (default)
            ref     : '@?'  // ref code
        },
        controller  : function ($scope, $rootScope, $location) {
            // Set defaults ------------------------------------------
            if($scope.root == 'true'){
                // set the url if root is true
                $scope.url  = 'https://stemn.com/';
            }
            else{
                // set the url to the current page otherwise
                $scope.url = $location.absUrl();
            }
            // add the ref code if it exists
            if($scope.ref){
                $scope.url = $scope.url.concat('?ref='+$scope.ref)
            }
            $scope.title   = $scope.title   || $rootScope.page.title;
            $scope.summary = $scope.summary || $rootScope.page.description;
            $scope.summaryShort = $scope.summary.slice(0,120)+'... '

            // Create the links for the share buttons
            $scope.shareDetails = [
                {
                    title : 'Share to twitter',
                    icon  : 'twitter',
                    href  : "https://twitter.com/home?status=" + $scope.summaryShort + "%20%20@stem_network%20" + $scope.url
                },{
                    title : 'Share to linkedin',
                    icon  : 'linkedin',
                    href  : "https://www.linkedin.com/shareArticle?mini=true&url=" + $scope.url + "&title=" + $scope.title + "&summary=" + $scope.summaryShort + "&source="
                },{
                    title : 'Share to facebook',
                    icon  : 'facebook',
                    href  : "https://www.facebook.com/sharer/sharer.php?u=" + $scope.url
                }
            ];
            $scope.shares = $scope.shareDetails;
//            if($scope.tiles){
//            }
//            else{
//                $scope.shares = [ $scope.shareDetails[0], $scope.shareDetails[2] ]
//            }
        }
    };
}).

directive('socialLinks', function ($timeout) {
    // This directive is used to create links to social accounts such as Facebook and Github
    // It can be used at either project or user pages with a different 'type' param
    // More links can easily be added. Be sure to change both the 'linkOrder' and 'links'
    // arrays.
    return {
        restrict : 'E',
        scope: {
            data     : '=',     // The data to manipulate - this is an object of the form:
                                // {github : 'DavidR', facebook : 'revay'}
            edit     : '=?',    // To show/hide edit
            type     : '@?',    // project, organisation or user?
            showEdit : '=?',    // showEdit button
            saveFn   : '&?'     // saveFn for edit modal
        },
        templateUrl: 'app/modules/social-media/tpls/social-links.html',
        controller: function($scope, $mdDialog){

            // Set defaults
            if(!$scope.data){$scope.data = {}}
            if(!$scope.type){$scope.type = 'user'}

            // Set link types
            if ($scope.type == 'user'){
                $scope.linkOrder = ['website','twitter','facebook','linkedin', 'github', 'google', 'stack', 'youtube'];
            }
            else if ($scope.type == 'project'){
                $scope.linkOrder = ['website','twitter','facebook', 'github', 'youtube'];
            }
            else if ($scope.type == 'organisation'){
                $scope.linkOrder = ['website','twitter','facebook', 'linkedin', 'youtube'];
            }
            else{
                console.log('Error - Social links Type must be defined')
            }

            $scope.editModal = editModal; //function(event)

            $scope.links = {

                website  : {
                    base : 'http://',
                    alt  : 'http://',
                    icon : 'fa-globe',
                },
                twitter  : {
                    base : 'https://twitter.com/',
                    icon : 'fa-twitter',
                },
                facebook : {
                    base : 'http://facebook.com/',
                    icon : 'fa-facebook'
                },
                linkedin : {
                    base : 'http://linkedin.com/',
                    icon : 'fa-linkedin'
                },
                github   : {
                    base : 'https://github.com/',
                    icon : 'fa-github'
                },
                google   : {
                    base : 'http://plus.google.com/',
                    icon : 'fa-google-plus'
                },
                stack    : {
                    base : 'http://stackoverflow.com/',
                    icon : 'fa-stack-overflow'
                },
                youtube  : {
                    base : 'http://youtube.com/',
                    icon : 'fa-youtube-play'
                }
            }

            ///////////////////////////////////////////////

            function editModal($event){
                $mdDialog.show({
                    templateUrl: 'app/modules/social-media/tpls/social-links-modal.html',
                    controller: function(data, type, $scope){
                        $scope.data = angular.copy(data);
                        $scope.type = type;
                        $scope.confirm = function () {
                            $mdDialog.hide($scope.data);
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    locals: {
                        data: $scope.data,
                        type: $scope.type
                    },
                    targetEvent: event,
                }).then(function(data){
                    $scope.data = data;
                    $timeout($scope.saveFn, 0);
                })
            }
        }
    };
});
