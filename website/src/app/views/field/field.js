import './field.scss';

angular.module('views.field', [
    'modules.fields',
]);

angular.module('views.field').
config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
    when("/fields/:stub", "/fields/:stub/projects");

    $stateProvider.
    state('app.field', {
        url: '/fields/:stub?projectview&location',
        sticky: true,
        template: require('./field.html'),
        resolve: {
            field: function (FieldService, $stateParams) {
                return FieldService.getField($stateParams.stub).then(function (field) {
                    return field;
                });
            },
        },
        abstract: true,
        controller: 'FieldViewCtrl',
        seo: function(resolve){
            return {
                title       : resolve.field.name + 'Field - STEMN',
                picture     : resolve.field.banner.url,
                description : resolve.field.blurb
            }
        },
        layout: {
            size: 'md',
            footer: true,
        },
    }).
    state('app.field.top', {
        url: '/top',
        template: require('./tpls/field-top.html'),
        seo: function(resolve){
            return {
                title       : 'Top ' + resolve.field.name + ' Projects, Questions and Organisations - STEMN',
            }
        },
    }).
    state('app.field.threads', {
        url: '/threads',
        template: require('./tpls/field-threads.html'),
        data: {
            name: 'forum'
        },
        seo: function(resolve){
            return {
                title       : resolve.field.name + ' Forum - Questions and Discussions - STEMN',
            }
        },
    }).
    state('app.field.blogs', {
        url: '/blogs',
        template: require('./tpls/field-blogs.html'),
        data: {
            name: 'updates'
        },
        seo: function(resolve){
            return {
                title       : 'Latest ' + resolve.field.name + ' Blogs and Project updates - STEMN',
            }
        },
    }).
    state('app.field.projects', {
        url: '/projects',
        template: require('./tpls/field-project.html'),
        data: {
            name: 'projects'
        },
        seo: function(resolve){
            return {
                title       : 'Latest ' + resolve.field.name + ' Projects - STEMN',
            }
        },
    }).
    state('app.field.jobs', {
        url: '/jobs',
        template: require('./tpls/field-jobs.html'),
        data: {
            name: 'jobs'
        },
        seo: function(resolve){
            return {
                title       : resolve.field.name + ' Jobs and careers - STEMN',
            }
        },
    }).
    state('app.field.organisations', {
        url: '/organisations',
        template: require('./tpls/field-organisations.html'),
        data: {
            name: 'organisations'
        },
        seo: function(resolve){
            return {
                title       : resolve.field.name + ' Organisations and Companies - STEMN',
            }
        },
    })
//    state('app.field.people', {
//        url: '/people',
//        template: require('./tpls/field-people.html'),
//        controller: 'FieldSubViewCtrl'
//    })
}).


controller('FieldViewCtrl', function ($scope, $rootScope, $state, field, FieldService, CoreLibrary, HttpService, PublishService) {
    $scope.field = field;
    $scope.showEdit = true;
    $scope.save = function () {
        FieldService.updateField($scope.field);
    };
    $scope.deleteField = function(){
        FieldService.deleteField($scope.field._id).then(function(){
            $state.go('app.browse.fields')
        });
    }
    $scope.editStub = editStub;

    /////////////////////////////

    function editStub(event){
        PublishService.selectStubModal(event, $scope.field).then(function(stub){
            $scope.field.stub = stub;
            $scope.save();
        })
    }


});
