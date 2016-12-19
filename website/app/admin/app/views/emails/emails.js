angular.module('views.emails', [
    'modules.search'
]);
angular.module('views.emails').

config(function ($stateProvider) {
    $stateProvider.state('app.emails', {
        url: "/emails",
        templateUrl: "app/views/emails/emails.html",
        controller: function($scope, HttpQuery, CoreLibrary, SearchService, EmailTemplates){

            $scope.query = HttpQuery({
                url: 'api/v1/emails',
                params: {
                    criteria: {},
                    size: 20,
                },
                onSuccess: function (response) {
                    _.forEach(response, function (item) {
                        item.created = CoreLibrary.getDateFromId(item._id)
                    })
                    return response;
                },
                columns: [{
                        status: true,
                        sort: false,

                        name: 'Recipient',
                        template: '<core-entity-picture entity-type="user" entity-id="{{item.recipient}}" entity="entity"></core-entity-picture>',
                        width: '50px',
                    }, {
                        status: true,
                        sort: false,

                        name: 'Time',
                        template: '{{item.created | amTimeAgo}}',
                        width: '100px',
                    }, {
                        status: true,
                        sort: false,

                        name: 'Details',
                        template: '<div>{{item.subject}}</div><div class="text-lightgrey">{{item.notificationType}}</div>',
                    }, {
                        status: true,
                        sort: false,

                        name: 'Actioner',
                        template: '<core-entity-picture entity-type="user" entity-id="{{item.actioner}}" entity="entity"></core-entity-picture>',
                        width: '50px',
                    },
                ],
                filters: {
                    columnOrder: {}
                },
            })
            $scope.query.more();

            $scope.ownerFilter = SearchService.newFilter({
                title   : 'Actioner',
                model   : 'criteria.actioner',
                options : [
                    {
                        model : '5498e258a7fbbfcc12c3fa15',
                        name  : 'Jackson'
                    },{
                        model : '55c0cb75dca1a7e5444c13f7',
                        name  : 'Denzil'
                    },{
                        model : '5496bdb8104ad2c800020602',
                        name  : 'Jack'
                    },{
                        model : '547db55af7f342380174e228',
                        name  : 'David'
                    },{
                        model : '565f9406ca3491aff9b9ad4a',
                        name  : 'Anthony Tan'
                    },{
                        model : '55e92c8142be6dba0b4c05e9',
                        name  : 'Toy'
                    },{
                        model : '56cfd32276dbc2072fc17a09',
                        name  : 'Email Templater'
                    },{
                        model : '56e14e058c106e6711b76ed7',
                        name  : 'Upwork'
                    }
                ],
                query : $scope.query
            });
            $scope.typeFilter = SearchService.newFilter({
                title   : 'Email Type',
                model   : 'criteria.notificationType',
                options : [],
                query : $scope.query
            });
            var backendEmailTypes = [
                'invite-to-stemn-by-email',
                'mailchimp-member-is-following-you',
                'new-thread-on-entity',
                'new-follow',
                'verify-email',
                'beta-signup-receipt',
                'beta-signup-receipt-social',
                'mailchimp-member-commented-on-project',
                'thread-new-post-on-thread',
                'stemn-jobs-announcement',
                'new-mention',
                'add-to-organisation',
                'mailchimp-member-invited-to-project',
                'password-reset',
                'password-reset-social',
            ];
            $scope.typeFilter.options = $scope.typeFilter.options.concat(_.map(backendEmailTypes, function(type){
                return {
                    model: type,
                    name : type
                }
            }))
            $scope.typeFilter.options = $scope.typeFilter.options.concat(_.map(EmailTemplates.get(), function(email){
                return {
                    model: email.name,
                    name : email.name
                }
            }))

        }
    });
})
