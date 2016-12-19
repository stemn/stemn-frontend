angular.module('views.reminders', [
    'modules.reminders'
]);
angular.module('views.reminders').

config(function ($stateProvider) {
    $stateProvider.state('app.reminders', {
        url: "/reminders",
        templateUrl: "app/views/reminders/reminders.html",
        controller: 'RemindersViewCtrl'
    });
}).

controller('RemindersViewCtrl', function ($scope, HttpQuery, EntityService, ReminderService, SearchService) {
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['page', 'criteria'],
        params: {
            criteria: {
                complete: false
            },
            type: 'reminder',
            size: 30,
            'select[]': ['*'],
        },
        columns: [{
                status: true,
                sort: false,

                name: 'User',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.user.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.user.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                width: '50px',
            },{
                status : true,

                name   : 'Notes',
                model  : 'notes',
            },{
                status : true,

                name   : 'Date',
                model  : 'reminderDate',
                width: '200px',
                template: '{{item.reminderDate | amCalendar}}'
            },{
                status: true,
                name: 'Complete',
                model: 'status',
                width: '50px',
                template: "<reminder-status entity='item' entities='query.results' selected-rows='selectedRows'></reminder-status>",
            },{
                status: true,
                sort: true,

                name: 'Owner',
                model: 'owner',
                template: '<a ui-sref="app.users.user.info({\'stub\': item.owner.stub})" class="avatar-circle block" style="background-image: url(\'https://stemn.com{{item.owner.picture || \'/assets/images/default/org.png\'}}?size=thumb&crop=true\')")"></a>',
                width: '50px',
            }, {
                status: true,
                sort: false,
                name: 'Actions',
                model: 'temp',
                width: '50px',
                template: `<reminder-row-actions entity="item" query="query"></reminder-row-actions>`,
            }
        ],
        filters: {
            columnOrder : {}
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
//    $scope.completeFilter = SearchService.newFilter({
//        title   : 'Complete',
//        model   : 'criteria.complete',
//        options : [
//            {
//                model : 'true',
//                name  : 'Complete'
//            },{
//                model : 'false',
//                name  : 'Incomplete'
//            }
//        ],
//        query : $scope.query
//    });

});
