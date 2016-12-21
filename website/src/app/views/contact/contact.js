angular.module('views.contact', []);
angular.module('views.contact').

config(function ($stateProvider) {
    $stateProvider.
    state('app.contact', {
        url: '/contact',
        templateUrl: 'app/views/contact/contact.html',
        controller: 'ContactFormCtrl',
        layout:{
            footer: true,
        },
        seo: function(resolve){
            return {
                title : "Get in touch - Contact STEMN",
            }
        }
    });
}).

controller('ContactFormCtrl', function ($scope, $rootScope, $http, $timeout, $mdToast) {
	$scope.contact = {};
	$scope.forms = {};
    $scope.submitContactForm = function () {
        if($scope.forms.contactForm.$valid){
            $http.post('/api/v1/mail/contact', $scope.contact).then(function (response) {
				$mdToast.show(
					$mdToast.simple().
					content("Your message has been sent, we'll get back to you ASAP.")
				);
				$scope.contact = {}
            }).catch(function(){
				$mdToast.show(
					$mdToast.simple().
					theme('warn').
					content("Something went wrong... We could't send the message.")
				);
			})
        }
    };
});

