angular.module('modules.confirm-click', []);
angular.module('modules.confirm-click').

directive('confirmClick', function ($mdDialog) {
    /******************************************

    This directive will pop a confirm modal.
    It can be modified with [confirm-title] and
    [confirm-body] attributes.

	confirm="false" will do nothing

    ******************************************/
    return {
        priority: 50,
        restrict: 'A',
        link: {
            pre: function (scope, element, attrs) {
				// Set the message data
                var data = {};
                data.confirmTitle = attrs.confirmTitle
                data.confirmBody = attrs.confirmBody
                data.confirmYes = attrs.confirmYes
                data.confirmNo = attrs.confirmNo

                var clickAction = attrs.ngClick || attrs.href;
                element.bind('click touchstart', function (event) {
					if(attrs.confirm != 'false'){
						event.stopImmediatePropagation();
						event.preventDefault();
						$mdDialog.show({
							templateUrl: 'app/modules/confirm-click/tpls/confirm-click-modal.html',
							controller: function(data, $scope){
								$scope.data = data;
								$scope.cancel = function () {
									$mdDialog.cancel();
								};
								$scope.confirm = function () {
									$mdDialog.hide();
								};
							},
							locals: {data: data},
							targetEvent: event,
						}).then(function(){
							scope.$eval(clickAction);
						});
					}
                });
            }
        }
    };
});
