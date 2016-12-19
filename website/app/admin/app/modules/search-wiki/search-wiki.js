angular.module('modules.search-wiki', []);
angular.module('modules.search-wiki').

directive('clickSearchWiki', function ($http, $mdToast) {
    return {
        restrict: 'A',
        scope: {
            name: '@', // Search name
            model: '=?'
        },
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
                $http.jsonp('http://en.wikipedia.org/w/api.php', {
                    params: {
                        action    : 'opensearch',
                        search    : scope.name,     // search query
                        limit     :1,               // return only the first result
                        namespace :0,               // search only articles, ignoring Talk, Mediawiki, etc.
                        format    : 'json',         // jsonfm prints the JSON in HTML for debugging.
                        callback  : 'JSON_CALLBACK'   // JSONP callback function
                    }
                }).then(function(response){
                    if(response.data[2][0].length > 5){
                        scope.model = response.data[2][0];
                        $mdToast.show($mdToast.simple().content('Results for: '+response.data[1]));
                    }
                    else{
                        $mdToast.show($mdToast.simple().content('No Results for: '+ scope.name).theme('warn'));
                    }
                });
			})
		}
    };
});
