import './footer.scss';
angular.module('modules.footer', [
]);
angular.module('modules.footer').

directive('footer', function (FooterService) {
    return {
        restrict: 'E',
        scope:{},
        replace: true,
        template: require('./tpls/footer.html'),
        controller: function ($scope, LayoutOptions) {
            $scope.LayoutOptions = LayoutOptions;
			$scope.items = FooterService.items;
        }
    };
}).

service('FooterService', function(Restangular) {
	this.items   = [
// {
//			text: 'Help',
//			sref: "app.field.top({'stub':'stemn-how-to'})"
//		},{
//			text: 'About',
//			sref: "app.project.overview({'stub':'stemn'})"
//		},{
//			text: 'Faq',
//			sref: "app.faq"
//		},{
//			text: 'Partners',
//			sref: "app.partners"
//		},{
//			text: 'Terms',
//			sref: "app.terms"
//		},
        {
			text: 'About',
			sref: "app.project.overview({'stub':'stemn'})"
		},{
			text: 'Careers',
			sref: "app.thread({'stub':'join-our-rocketship'})"
		},{
			text: 'Terms & Privacy',
			sref: "app.terms"
		},{
			text: 'Partners',
			sref: "app.partners"
		},{
			text: 'Say Hello',
			sref: "app.project.overview({'stub':'stemn'})"
		},

	]
});
