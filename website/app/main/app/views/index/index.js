angular.module('views.index', [
//    'views.index.jobs'
]);
angular.module('views.index').

config(function ($stateProvider) {
    $stateProvider.
    state('app.index', {
        url: '/explore',
        template: '<ui-view></ui-view>',
        layout: {
            size: 'md',
            footer: true,
        },
    }).

    state('app.jobsIndex', {
        url: '/explore/jobs',
        templateUrl: 'app/views/index/tpls/jobs-index.html',
        resolve: {
            fields: function(SearchService){
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 40,
                    sort: 'numJobs',
                    select: ['name','stub','picture'],
                    key: 'name',
                }).then(function (response) {
                    return response.data
                });
            }
        },
        controller: function(fields, $scope, LocationService){
            $scope.fields = fields;
        },
        seo: function(resolve){
            return {
                title : "Explore Jobs by Fields Category - STEMN",
                description : "Find a jobs that interest you. Explore jobs near you in Science, Engineering and Aerospace."
            }
        },
        layout: {
            size: 'md',
            footer: true,
        },
    }).

    state('app.jobsQuery', {
        url: '/browse-jobs/:field?locations',
        templateUrl: 'app/views/index/tpls/jobs-query-field.html',
        resolve: {
            field: function(SearchService, $stateParams){
                return SearchService.search({
                    key       : 'stub',
                    type      : 'field',
                    size      : 1,
                    value     : $stateParams.field,
                    'select[]': ['name', 'stub'],
                }).then(function (response) {
                    return response.data[0]
                });
            },
        },
        controller: function(field, $scope, $http, $stateParams, $state, $timeout){
            $scope.field    = field;

            $http({
                method : 'GET',
                url    : 'api/v1/jobs/locations',
                params : {
                    size: 10
                }
            }).then(function (response) {
                console.log(response)
                $scope.locations = response.data;
            });

            // Function to scope
            $scope.assignStateParams = assignStateParams;

            assignStateParams();

            //////////////////////////////

            function assignStateParams(){
                $timeout(function(){
                    $scope.locationsPage  = parseInt($state.params.locations || 1);
                    $scope.locationsLimit = ($scope.locationsPage * 10) - 1;
                })

            }


//            $http({
//                method : 'GET',
//                url    : 'https://maps.googleapis.com/maps/api/place/photo',
//                params : {
//                    maxwidth:400,
//                    photorefrence: 'CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU',
//                    key: 'AIzaSyAR4w1kCzux3l-vTEardxTOZ4tXRM4df_k'
//                }
//            }).then(function (response) {
//                console.log(response);
//            });

        },
        seo: function(resolve){
            return {
                title   : "Explore " + resolve.field.name + " Jobs - STEMN",
                picture : resolve.field.picture,
            }
        },
        layout: {
            size: 'md',
            footer: true,
        },
    }).

    state('app.jobsQuery.location', {
        url: '/:location',
        templateUrl: 'app/views/index/tpls/jobs-query-field-location.html',
        resolve: {
            location: function(LocationService, $stateParams){
                return LocationService.geoCode($stateParams.location).then(function(response){
                    return response[0]
                })
            }
        },
        controller: function(location, field, $scope){
            $scope.field    = field;
            $scope.location = location;
        },
        seo: function(resolve){
            return {
                title   : "Explore " + resolve.field.name + " Jobs and Careers in " + resolve.location.components[0].long_name + " - STEMN",
                picture : resolve.field.picture,
            }
        },
    })
});
