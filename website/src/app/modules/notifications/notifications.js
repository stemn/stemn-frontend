import './notifications.scss';

angular.module('modules.notifications', [
    'modules.authentication'
]);
angular.module('modules.notifications').

directive('notifications', function () {
    return {
        restrict: 'E',
		replace: true,
        template: require('./tpls/notifications.html'),
		controller: function($scope, NotificationService, $state, HttpQuery){
            $scope.query = NotificationService.query;

			$scope.markAllRead = NotificationService.markAllRead; // function()
			$scope.markRead    = NotificationService.markRead;    // function(notification)
            $scope.goSettings  = function(){
                $state.go('app.usersettings.notifications')
            }

		}
    };
}).

directive('notification', function () {
    return {
        restrict: 'E',
		replace: true,
        template: require('./tpls/notification.html'),
    };
}).

service('NotificationService', function(Authentication, favicoService, $interval, HttpService, HttpQuery, $http) {

    var service = this;

    $interval(function() {
        service.query.refresh();
    }, 20000);

    this.query = HttpQuery({
        url: 'api/v1/notifications',
        params: {
            size: 20,
            order: 'timestamp',
        },
        onSuccess      : function(results){
            _.forEach(results, function (notification) {
                notification.text = service.notificationText[notification.type];
            });
            service.updateFavicoCount();
            return results
        }
    });
    this.query.more();

    this.notificationText = {
        'added-project'                      : 'added you to their project',
        'added-organisation'                 : 'added you to the organisation',
        'invite-accepted'                    : 'joined',
        'followed-user-project'              : 'has a new project',
        'followed-user-blog'                 : 'has a new blog',
        'followed-user-general'              : 'has a new discussion',
        'followed-user-question'             : 'has a new question',
        'followed-project-blog'              : 'has a new blog',
        'followed-project-general'           : 'has a new discussion',
        'followed-project-question'          : 'has a new question',
        'followed-project-post'              : 'commented',
        'followed-field-project'             : 'has a new project',
        'followed-field-blog'                : 'has a new blog',
        'followed-field-general'             : 'has a new discussion',
        'followed-organisation-project'      : 'has a new project',
        'followed-field-question'            : 'has a new question',
        'followed-organisation-blog'         : 'has a new blog',
        'followed-organisation-general'      : 'has a new discussion',
        'followed-organisation-question'     : 'has a new question',
        'followed-own-user'                  : 'is now following you.',
        'followed-own-project'               : 'is now following your project',
        'followed-own-question'              : 'is now following your question',
        'followed-own-blog'                  : 'is now following your blog',
        'followed-own-general'               : 'is now following your discussion',
        'followed-own-organisation'          : 'is now following your organisation',
        'followed-question-post'             : 'posted an answer in',
        'followed-blog-post'                 : 'posted a comment on',
        'followed-general-post'              : 'posted a reply in',
        'own-question-post'                  : 'answered your question',
        'own-blog-post'                      : 'posted on your blog',
        'own-general-post'                   : 'replied in your discussion',
        'own-question-like'                  : 'liked your question',
        'own-blog-like'                      : 'liked your blog',
        'own-general-like'                   : 'liked your discussion',
        'own-post-like'                      : 'liked your post',
        'own-post-post'                      : 'replied to your post',
        'own-user-mention'                   : 'mentioned you in',
        'own-project-mention'                : 'mentioned your project in',
        'own-organisation-mention'           : 'mentioned your organisation in',
        'own-blog-mention'                   : 'mentioned your blog in',
        'own-general-mention'                : 'mentioned your discussion in',
        'own-question-mention'               : 'mentioned your question in',

        'own-application-pendingReview'      : 'application is now pending review.',
        'own-application-underReview'        : 'application is now under review.',
        'own-application-awaitingUpdate'     : 'application is awaiting update.',
        'own-application-readyToSubmit'      : 'application is now submitted.',
        'own-application-submittedToCompany' : 'application has been rejected.',
        'own-application-rejected'           : 'application has been rejected.',
        'own-application-processLater'       : 'application is now submitted.',
    }

    ////////////////////////////////////////

    this.markAllRead = function () {
        _.each(service.query.results, function (notification) {
            service.markRead(notification);
        });
    }

    this.markRead = function (notification) {
        notification.read = true;
        service.updateFavicoCount();
        return $http({
            method : 'PUT',
            url    : '/api/v1/notifications/' + notification._id,
            data   : {
                read : true
            }
        })
    }

    this.updateFavicoCount = function(count) {
        count = count || _.where(service.query.results, { read : false }).length;
        favicoService.badge(count);
    }
});
