
angular.module('views.github', [
]);
angular.module('views.github').

config(function ($stateProvider) {
    $stateProvider.state('app.github', {
        url: "/github",
        templateUrl: "app/views/github/github.html",
        controller: 'GithubViewCtrl'
    });
}).

controller('GithubViewCtrl', function ($scope, $http, $mdToast) {
    $scope.projectQueryString = 'fork:true language:eagle language:kicad'


    $scope.getFiles = getFiles;

    $scope.projectQuery = {
        loading: false,
        get : getProjects,
        page : 1,
        queryString: 'fork:true language:eagle language:kicad',
    }

    $scope.fileQuery = {
        loading: false,
        get : getFiles,
        repoName: '',
        fileTypes: 'extension:kicad_pcb extension:pcb extension:brd'
    }

    $scope.repoEventsQuery = {
        loading: false,
        get : getRepoEvents,
        params: {
            page: 1,
            full_name: '',
        }
    }

    $scope.getUserEmail = function(item){
        getUserEmail(item.login).then(function(email){
            item.email = email;
        })
    }

    $scope.projectQuery.get();

    ////////////////////////


    function getProjects(){
        $scope.projectQuery.loading = true;
        $http({
            method: 'GET',
            url: 'https://api.github.com/search/repositories',
            skipAuthorization: true,
            params: {
                q:$scope.projectQuery.queryString,
                sort:'stars',
                order:'desc',
                page: $scope.projectQuery.page,
                per_page: 100
            }
        }).then(function(response){
            $scope.projectQuery.loading = false;
            $scope.projects = response.data.items;
        }).catch(showErrorMessage)
    }

    function getRepoEvents(){
        var size = 40;
        $http({
            method: 'GET',
            url: 'https://api.github.com/repos/'+$scope.repoEventsQuery.params.full_name+'/events',
            skipAuthorization: true,
            params: {
                page: $scope.repoEventsQuery.params.page,
                per_page: size
            }
        }).then(function(response){
            $scope.repoEventsQuery.results = response.data;
            console.log($scope.repoEventsQuery.results);
        }).catch(showErrorMessage)
    }

    function getUserEmail(user, page){
        var size = 40;
        page = page || 1;
        return $http({
            method: 'GET',
            url: 'https://api.github.com/users/'+user+'/events/public',
            params: {
                page: page,
                per_page: size
            },
            skipAuthorization: true,
        }).then(function(response){
            // We look for a push event
            var pushEvent = _.find(response.data, 'type', 'PushEvent');
            if(!pushEvent && response.data.length == size){
                page++
                return getUserEmail(user, page)
            }
            else{
                if(!pushEvent){
                    return 'Unknown - P'+page
                }
                else{
                    console.log(pushEvent);
                    return pushEvent.payload.commits[0].author.email
                }
            }
        }).catch(showErrorMessage)
    }

    function getFiles(){
        $http({
            method: 'GET',
            url: 'https://api.github.com/search/code',
            skipAuthorization: true,
            params: {
                q: 'repo:'+$scope.fileQuery.repoName + ' ' + $scope.fileQuery.fileTypes,
                sort:'stars',
                order:'desc'
            }
        }).then(function(response){
            $scope.files = _.map(response.data.items, function(item){
                return {
                    previewUrl : 'http://embed.stemn.com/preview-github?path='+item.html_url.replace('/blob','').replace('github.com', 'raw.githubusercontent.com'),
                    name       : item.name
                }
            });
        }).catch(showErrorMessage)
    }

    function showErrorMessage(response){
        if(response.data.message){
            $mdToast.show($mdToast.simple().content(response.data.message).theme('warn'));
        }
    }

});
