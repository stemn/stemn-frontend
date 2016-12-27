import './notifications.scss';

angular.module('views.notifications', []);
angular.module('views.notifications').

config(function ($stateProvider) {
    $stateProvider.
    state('app.notifications', {
        url: '/notifications',
        abstract: true,
        template: require('./notifications.html'),
        controller: function($scope){
            $scope.tabs = [
                {
                    label: 'All',
                    sref: 'app.notifications.all'
                },{
                    label: 'Invites',
                    sref: 'app.notifications.invites'
                },{
                    label: 'Job Applications',
                    sref: 'app.notifications.applications'
                }
            ];
        },
        layout: {
            size: 'md',
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function(resolve){
            return {
                title : "Notifications - STEMN",
            }
        }
    }).
    state('app.notifications.all', {
        url: '',
        sticky: true,
        views: {
            'all': {
                template: require('./notifications-all.html'),
            }
        }
    }).
    state('app.notifications.invites', {
        url: '/invites',
        views: {
            'invites': {
                template: require('./notifications-invites.html'),
            }
        }
    }).
    state('app.notifications.applications', {
        url: '/applications',
        views: {
            'applications': {
                template: require('./notifications-applications.html'),
            }
        }
    });
}).


directive('notificationCards', function () {
    return {
        restrict: 'E',
        scope: {
            query : '=',
            type  : '=?'
        },
        template: require('./tpls/notification-cards.html'),
        controller: function($scope, NotificationService, HttpQuery) {
            $scope.query = HttpQuery({
                url: 'api/v1/notifications',
                params: {
                    size: 20,
                    order: 'timestamp',
                    criteria: {
                        type: $scope.type
                    }
                },
                onSuccess      : function(results){
                    _.forEach(results, function (notification) {
                        notification.text = NotificationService.notificationText[notification.type];
                    });
                    return results
                }
            });
            $scope.query.more();
        },
    }
});

