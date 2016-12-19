angular.module('views.referrals', [
]);
angular.module('views.referrals').

config(function ($stateProvider) {
    $stateProvider.state('app.referrals', {
        url: "/referrals",
        templateUrl: "app/views/referrals/referrals.html",
        controller: 'ReferralsViewCtrl'
    });
}).

controller('ReferralsViewCtrl', function ($scope, HttpQuery, EntityService, ReminderService, SearchService) {
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['page', 'criteria'],
        params: {
            type: 'referral',
            size: 30,
            order: 'dsc',
            sort: 'date',
            populate: false,
            'select[]': ['*', 'owner'],
        },
        columns: [{
                status: true,
                sort: false,

                name: 'User',
                template: '<core-entity-picture entity-type="user" entity-id="{{item._id}}" entity="item.user"></core-entity-picture>',
                width: '50px',
            },{
                status : true,
                sort: false,

                name   : 'Name',
                template: '{{item.user.name}}'
            },{
                status : true,

                name   : 'Hits',
                model  : 'numHits',
                width: '80px',
            },{
                status : true,

                name   : 'Signups',
                model  : 'numSignups',
                template: `
                    <a click-show-entities="item.signups">{{item.numSignups}}</a>
                `,
                width: '80px',
            },{
                status: true,
                sort: true,

                name: 'Code',
                model: 'ref',
                width: '50px',
            }
        ],
        filters: {
            columnOrder : {}
        },
        onSuccess: function(results){
            // Map each of the ref-signups to the {type:'user', id:XXXX} form
            _.forEach(results, function(result){
                result.signups = _.map(result.signups, function(item){
                    return {type: 'user', id  : item.user}
                })
            })
            return results
        },
    });
    $scope.query.init();

    $scope.newReminder = ReminderService.newReminderModal; //function(event);


    $scope.ownerFilter = SearchService.newFilter({
        title   : 'User Type',
        model   : 'criteria.owner',
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
});
