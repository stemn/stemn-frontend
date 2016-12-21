angular.module('views.browse.threads', [

]);
angular.module('views.browse.threads').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.threads', {
        url: '/threads?sort&order&parentType&parentId&criteria',
        templateUrl: 'app/views/browse/browse-threads/browse-threads.html',
        resolve: {
            fields: function (SearchService, $stateParams) {
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numThreads',
                    select: ['name','numThreads'],
                    key: 'name',
                }).then(function (response) {
                    return response.data
                });
            }
        },
        seo: function(resolve){
            return {
                title : "Browse Engineering and Threads - STEMN",
            }
        },
        layout: {
            size: 'lg',
            footer: true
        },
        controller: 'BrowseThreadsViewCtrl',
        data: {
            name: 'Threads'
        }
    })
}).

controller('BrowseThreadsViewCtrl', function(fields, $scope, $stateParams, FeedService, ThreadCreateModalService, ThreadLabelService){

    $scope.newThread = ThreadCreateModalService.newThread; //function(event)
    $scope.fieldFilter = {
        current: '',
        options: fields,
        change: function(input){
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId   = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.statusFilter = {
        current: '',
        options: [{
            name : 'All',
            model : ''
        },{
            name : 'Answered',
            model : 'answered'
        },{
            name : 'Unanswered',
            model : 'unanswered'
        },

        ],
        change: function(input){
            if(input == 'answered'){
                $scope.query.params.criteria.numPosts = ';>1';
            }
            else if(input == 'unanswered'){
                $scope.query.params.criteria.numPosts = '0';
            }
            else{
                $scope.query.params.criteria.numPosts = '';
            }
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };
    $scope.typeFilter = {
        current: '',
        change: function(input){
            console.log(input);
            if(input){
                $scope.query.params.criteria.labels = [input];
            }
            else{
                $scope.query.params.criteria.labels = [];
            }
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    $scope.typeFilter.options = angular.copy(ThreadLabelService.labels);
    $scope.typeFilter.options.unshift({label: 'All', model: ''})

    $scope.sortFilter = {
        current : $stateParams.sort || 'updated',
        options : [
            {
                model : 'views',
                name  : 'Views'
            },{
                model : 'numComments',
                name  : 'Replies'
            },{
                model : 'likes',
                name  : 'Likes'
            },{
                model : 'updated',
                name  : 'Updated'
            }
        ]
    };


});
